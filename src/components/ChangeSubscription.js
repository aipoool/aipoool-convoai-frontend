import React, { useState, useEffect } from 'react';
import axios from 'axios';

const useQuery = () => {
    return new URLSearchParams(window.location.search);
};

const ChangeSubscription = () => {
  const [currentPlan, setCurrentPlan] = useState('');
  const [step, setStep] = useState(1);
  const [reason, setReason] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [availableDowngradePlans, setAvailableDowngradePlans] = useState([]);
  const [availableUpgradePlans, setAvailableUpgradePlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [userjwtToken, setUserjwt] = useState({}); 
  const [currentPlanId, setCurrentPlanId] = useState({}); 

  const query = useQuery();
  const subscriptionId = query.get('subscription_id');

  const fetchCurrentPlan = async () => {
    // getting the token from the local storage
    const storedToken = localStorage.getItem('convoaiUserProfData');
    if (storedToken) {
      const userToken = JSON.parse(storedToken);
      console.log('Retrieved user data from settings page:', userToken);
      const secureToken = `${userToken}c0Nv0AI`;
      setUserjwt(secureToken);
      
    } else {
      console.log('No user data found in localStorage');
    }

    if(subscriptionId){
      console.log(subscriptionId)
      try{
        const response = await axios.get(`https://aipoool-convoai-backend.onrender.com/api/subscription-details/${subscriptionId}`, 
          {
            headers: {
              Authorization: `Bearer ${userjwtToken}`, // Send the token in the Authorization header
            },
            withCredentials: true, // Include credentials if necessary (cookies, etc.)
          });
        

        console.log("User data here ::: " , response.data); 
        setCurrentPlan(response.data);
        console.log(response.data.plan_id); 
        setCurrentPlanId(response.data.plan_id); 
      }catch(error){ 
        console.log("error", error); 
      }
    }
  };


  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  const handleNext = async () => {
    setLoading(true);
    console.log('Current Step:', step); // Check current step
    if (step === 2) {
      // Downgrade: Fetch available downgrade plans
      try {
        console.log("currentPlanId :: " , currentPlanId)
        const response = await axios.get(`https://aipoool-convoai-backend.onrender.com/api/getAvailableDowngradePlans/${currentPlanId}`,
            {
                headers: {
                  Authorization: `Bearer ${userjwtToken}`, // Send the token in the Authorization header
                },
                withCredentials: true, // Include credentials if necessary (cookies, etc.)
            });
        console.log('Plans here ::: ' , response.data); 
        setAvailableDowngradePlans(response.data);
        setStep(3);
      } catch (error) {
        console.error('Error fetching downgrade plans:', error);
      }
      setLoading(false);
    } else if (step === 4) {
      // Upgrade: Ask for reason to upgrade
      setStep(5);
    } else if (step === 5) {
      // Fetch available upgrade plans
      try {
        const response = await axios.get(`https://aipoool-convoai-backend.onrender.com/api/getAvailableUpgradePlans/${currentPlanId}`,
        {
            headers: {
                Authorization: `Bearer ${userjwtToken}`, // Send the token in the Authorization header
            },
            withCredentials: true, // Include credentials if necessary (cookies, etc.)
        });
        console.log('Upgrade Plans here ::: ' , response.data); 
        setAvailableUpgradePlans(response.data);
        setStep(6);
      } catch (error) {
        console.error('Error fetching upgrade plans:', error);
      }
      setLoading(false);
    } else if (step === 6 || step === 3) {
      // Final step: Confirm the plan selection
      setStep(7);
    }
  };

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const response = await axios.post('https://aipoool-convoai-backend.onrender.com/api/changePlan', 
        { planId: selectedPlan },
        {
            headers: {
                Authorization: `Bearer ${userjwtToken}`, // Send the token in the Authorization header
            },
            withCredentials: true, // Include credentials if necessary (cookies, etc.)
        }
      ); // Replace with actual API endpoint
      setMessage('Plan changed successfully!');
      setLoading(false);
      // Optionally, redirect or update UI
    } catch (error) {
      console.error('Error changing plan:', error);
      setMessage('Failed to change the plan.');
      setLoading(false);
    }
  };

  const renderPlans = (plans) => {
    return plans.map((plan, index) => (
      <div
        key={index} // Use index or a unique key if available
        className="plan-option"
        style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '16px',
          cursor: 'pointer',
          backgroundColor: selectedPlan === plan.planId ? '#f0f0f0' : '#fff',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={() => setSelectedPlan(plan.planId)}
      >
        <h3>{plan.planName}</h3>
        <p>{plan.planDescription}</p>
        <p><strong>Price: </strong>{plan.planPrice}</p>
      </div>
    ));
  };

  useEffect(() => {
    // Fetch the current plan from the backend
    if(userjwtToken){
      fetchCurrentPlan();
    }
  }, [userjwtToken, subscriptionId]);

  return (
    <div>
      <h1>Upgrade/Downgrade the Plan</h1>
      {step === 1 && (
        <div>
            <p><strong>Current Plan:</strong></p>
            {currentPlan && (
            <div>
                <p>Plan Name: {currentPlan.plan_name}</p>
                <p>Plan Description: {currentPlan.plan_description}</p>
                <p>Plan Status: {currentPlan.status}</p>
                {/* Add more fields as necessary */}
            </div>
            )}
            <button onClick={() => {
                setStep(2);
                console.log(`Downgrade button clicked, step should be ${step} now`);
                }}>Downgrade</button>
            <button onClick={() => {
            setStep(4);
            console.log(`Upgrade button clicked, step should be ${step} now`);
            }}>Upgrade</button>
        </div>
        )}
      
      {step === 2 && (
        <div>
          <h2>Why do you want to downgrade?</h2>
          <textarea
            value={reason}
            onChange={handleReasonChange}
            placeholder="Enter your reason"
            style={{ width: '100%', height: '100px' }}
          />
          <div style={{ marginTop: '20px' }}>
            <button onClick={() => setStep(1)}>Go Back</button>
            <button
              onClick={handleNext}
              disabled={!reason.trim()}
            >
              Next
            </button>
          </div>
        </div>
      )}
      
      {step === 3 && (
        <div>
          <h2>Select a plan to downgrade to</h2>
          {loading ? <p>Loading plans...</p> : renderPlans(availableDowngradePlans)}
          <div style={{ marginTop: '20px' }}>
            <button onClick={() => setStep(2)}>Go Back</button>
            <button
              onClick={handleNext}
              disabled={!selectedPlan}
            >
              Next
            </button>
          </div>
        </div>
      )}
      
      {step === 5 && (
        <div>
          <h2>Why do you want to upgrade?</h2>
          <textarea
            value={reason}
            onChange={handleReasonChange}
            placeholder="Enter your reason"
            style={{ width: '100%', height: '100px' }}
          />
          <div style={{ marginTop: '20px' }}>
            <button onClick={() => setStep(1)}>Go Back</button>
            <button
              onClick={handleNext}
              disabled={!reason.trim()}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 6 && (
        <div>
          <h2>Select a plan to upgrade to</h2>
          {loading ? <p>Loading plans...</p> : renderPlans(availableUpgradePlans)}
          <div style={{ marginTop: '20px' }}>
            <button onClick={() => setStep(5)}>Go Back</button>
            <button
              onClick={handleNext}
              disabled={!selectedPlan}
            >
              Next
            </button>
          </div>
        </div>
      )}
      
      {step === 7 && (
        <div>
          <h2>Confirm Your Plan Selection</h2>
          {selectedPlan && (
            <div>
              <h3>Selected Plan:</h3>
              {renderPlans([selectedPlan === availableDowngradePlans.find(p => p.planId === selectedPlan) ? availableDowngradePlans.find(p => p.planId === selectedPlan) : availableUpgradePlans.find(p => p.planId === selectedPlan)])}
            </div>
          )}
          <div style={{ marginTop: '20px' }}>
            <button onClick={() => setStep(step === 3 ? 3 : 6)}>Go Back</button>
            <button onClick={handleSubscribe}>Confirm Plan</button>
          </div>
        </div>
      )}
      
      {message && <p>{message}</p>}
    </div>
  );
};

export default ChangeSubscription;
