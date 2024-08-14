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
  const [availablePlans, setAvailablePlans] = useState([]);
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


  const handleDowngradeReasonChange = (e) => {
    setReason(e.target.value);
  };

  const handleNext = async () => {
    setLoading(true);
    if (step === 2) {
      try {
        console.log("currentPlanId :: " , currentPlanId)
        const response = await axios.get(`https://aipoool-convoai-backend.onrender.com/api/getAvailableDowngradePlans/${currentPlanId}` ,
            {
                headers: {
                  Authorization: `Bearer ${userjwtToken}`, // Send the token in the Authorization header
                },
                withCredentials: true, // Include credentials if necessary (cookies, etc.)
            }); // Replace with actual API endpoint
        console.log('Plans here ::: ' , response); 
        console.log('Also plans here ::: ', response.data); 
        setAvailablePlans(response.data);
        setStep(3);
      } catch (error) {
        console.error('Error fetching downgrade plans:', error);
      }
      setLoading(false);
    } else if (step === 4) {
      try {
        const response = await axios.get(`https://aipoool-convoai-backend.onrender.com/api/getAvailableUpgradePlans/${currentPlanId}`, 
        {
            headers: {
                Authorization: `Bearer ${userjwtToken}`, // Send the token in the Authorization header
            },
            withCredentials: true, // Include credentials if necessary (cookies, etc.)
        }); // Replace with actual API endpoint 
        setAvailablePlans(response.data);
        console.log('Plans here ::: ' , response); 
        console.log('Also plans here ::: ', response.data); 
        setStep(5);
      } catch (error) {
        console.error('Error fetching upgrade plans:', error);
      }
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/changePlan', 
        { planId }
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

  const renderPlans = () => {
    return availablePlans.map((plan, index) => (
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
            <button onClick={() => setStep(2)}>Downgrade</button>
            <button onClick={() => setStep(4)}>Upgrade</button>
        </div>
        )}
      
      {step === 2 && (
        <div>
          <h2>Why do you want to downgrade?</h2>
          <textarea
            value={reason}
            onChange={handleDowngradeReasonChange}
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
          {loading ? <p>Loading plans...</p> : renderPlans()}
          <div style={{ marginTop: '20px' }}>
            <button onClick={() => setStep(2)}>Go Back</button>
            <button
              onClick={() => handleSubscribe(selectedPlan)}
              disabled={!selectedPlan}
            >
              Subscribe to this plan
            </button>
          </div>
        </div>
      )}
      
      {step === 4 && (
        <div>
          <h2>Select a plan to upgrade to</h2>
          {loading ? <p>Loading plans...</p> : renderPlans()}
          <div style={{ marginTop: '20px' }}>
            <button onClick={() => setStep(1)}>Go Back</button>
            <button
              onClick={() => handleSubscribe(selectedPlan)}
              disabled={!selectedPlan}
            >
              Subscribe to this plan
            </button>
          </div>
        </div>
      )}
      
      {message && <p>{message}</p>}
    </div>
  );
};

export default ChangeSubscription;
