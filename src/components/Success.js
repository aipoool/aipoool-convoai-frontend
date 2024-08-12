import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
/*global chrome*/ 

const useQuery = () => {
  return new URLSearchParams(window.location.search);
};

const PaymentSuccess = () => {
  const query = useQuery();
  const subscriptionId = query.get('subscription_id');
  const navigate = useNavigate();

  const [userdata, setUserdata] = useState({}); 
  const [userjwtToken, setUserjwt] = useState({}); 

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

  const getSubscriberDetails = async () => {

    // if (subscriptionId) {
    //   fetch(`https://aipoool-convoai-backend.onrender.com/api/subscription-details/${subscriptionId}`)
    //     .then((response) => response.json())
    //     .then((data) => {
    //       console.log('Subscription details:', data);
    //       setSubscriptionDetails(data);
    //     })
    //     .catch((error) => console.error('Error fetching subscription details:', error));
    // }


    if(subscriptionId){
      try{
        const response = await axios.get(`https://aipoool-convoai-backend.onrender.com/api/subscription-details/${subscriptionId}`, 
          {
            headers: {
              Authorization: `Bearer ${userjwtToken}`, // Send the token in the Authorization header
            },
            withCredentials: true, // Include credentials if necessary (cookies, etc.)
          });

          console.log(response);
        setUserdata(response.data.user);
         
        
      }catch(error){ 
        console.log("error", error); 
      }

    }
  };

  console.log(userdata);


    const paymentEmail = userdata?.subscriber?.email_address;
    const subscriptionStartDate = userdata?.start_time;
    const nextBillingDate = userdata?.billing_info?.next_billing_time;
    const amountPaid = userdata?.billing_info?.last_payment?.amount?.value;
    const planType = userdata?.plan_name;
    const planDescription = userdata?.plan_description; 



  useEffect(() => {
    fetchSessionData();
    getSubscriberDetails();

    // if (subscriptionId) {
    //   fetch(`https://aipoool-convoai-backend.onrender.com/api/subscription-details/${subscriptionId}`)
    //     .then((response) => response.json())
    //     .then((data) => {
    //       console.log('Subscription details:', data);
    //       setSubscriptionDetails(data);
    //     })
    //     .catch((error) => console.error('Error fetching subscription details:', error));
    // }
  }, [subscriptionId]);



  // setting the subscription data into the db 


  return (
    <div>
      <h1>Payment Successful</h1>
      <p>Thank you! Your payment has been successfully processed.</p>
      {subscriptionId && (
        <p><strong>Subscription ID:</strong> {subscriptionId}</p>
      )}
      {userdata && (
        <div>
          <p><strong>Payment Email:</strong> {paymentEmail}</p>
          <p><strong>Subscription Start Date:</strong> {new Date(subscriptionStartDate).toLocaleString()}</p>
          <p><strong>Next Billing Date:</strong> {new Date(nextBillingDate).toLocaleString()}</p>
          <p><strong>Amount Paid:</strong> ${amountPaid}</p>
          <p><strong>Plan Type:</strong> {planType}</p>
          <p><strong>Plan Description:</strong> {planDescription}</p>
        </div>
      )}
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => navigate.push('/settings')}>Go to Settings Page</button>
        <button onClick={() => navigate.push('/')}>Go to Homepage</button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
