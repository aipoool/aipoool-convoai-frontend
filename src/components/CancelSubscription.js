import React, { useEffect, useState } from 'react';
import axios from 'axios';

const useQuery = () => {
    return new URLSearchParams(window.location.search);
  };

const CancelSubscription = () => {
  const [reason, setReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [userjwtToken, setUserjwt] = useState({}); 

  const query = useQuery();
  const subscriptionId = query.get('subscription_id');
  let selectedReason; 

  const fetchSessionData = async () => {
    try {
      const storedToken = localStorage.getItem('convoaiUserProfData');
      if (storedToken) {
        const userToken = JSON.parse(storedToken);
        console.log('Retrieved user data from settings page:', userToken);
        const secureToken = `${userToken}c0Nv0AI`;
        setUserjwt(secureToken);
        
      } else {
        console.log('No user data found in localStorage');
      }
    } catch (error) {
      console.error('Error fetching session data:', error);
    }
  };

  const handleReasonChange = (e) => {
    setReason(e.target.value);
    if (e.target.value !== 'Others') {
      setOtherReason(''); // Clear the other reason if "Others" is not selected
    }
  };

  const handleOtherReasonChange = (e) => {
    setOtherReason(e.target.value);
  };

  const handleSubmit = () => {
    selectedReason = reason === 'Others' ? otherReason : reason;
    console.log('Cancellation reason:', selectedReason);
    // You can add further processing here, such as sending the reason to a backend
    setLoading(true);
    setCancelSubscription(); 
  };

  const setCancelSubscription = async () => {
    try {

      const response = await axios.post(
        "https://aipoool-convoai-backend.onrender.com/api/unsubscribe",
        { 
            subscriptionId: subscriptionId , 
            reasonToUnsubscribe : selectedReason,
        }, 
        {
          headers: {
            Authorization: `Bearer ${userjwtToken}`, // Send the token in the Authorization header
          },
          withCredentials: true, // Include credentials if necessary (cookies, etc.)
        }
      );

      if (response.status === 200) {
        setMessage("Subscription successfully cancelled");
        setLoading(false); // Stop the loading spinner
      }
  
  
    } catch (error) {
      console.error("Error during unsubscription:", error);
      setMessage("Failed to cancel the subscription");
      setLoading(false); // Stop the loading spinner
    }
  };

  useEffect(() => {
    fetchSessionData();
  }, []); // Run only once when the component mounts

  return (
    <div>
      <h1>Reason to Cancel</h1>
      <div>
        <label>
          <input
            type="radio"
            value="Too Expensive"
            checked={reason === 'Too Expensive'}
            onChange={handleReasonChange}
          />
          Too Expensive
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            value="Not Using Enough"
            checked={reason === 'Not Using Enough'}
            onChange={handleReasonChange}
          />
          Not Using Enough
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            value="Technical Issues"
            checked={reason === 'Technical Issues'}
            onChange={handleReasonChange}
          />
          Technical Issues
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            value="Switching to a Competitor"
            checked={reason === 'Switching to a Competitor'}
            onChange={handleReasonChange}
          />
          Switching to a Competitor
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            value="Others"
            checked={reason === 'Others'}
            onChange={handleReasonChange}
          />
          Others
        </label>
        {reason === 'Others' && (
          <textarea
            value={otherReason}
            onChange={handleOtherReasonChange}
            placeholder="Please specify your reason"
          />
        )}
      </div>
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Processing...' : 'Submit'}
      </button>

      {loading && <p>Loading...</p>}
      {message && <p>{message}</p>}
    </div>
  );

};

export default CancelSubscription;
