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
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [userdata, setUserdata] = useState({});
  const navigate = useNavigate();

  const fetchSessionData = async() => {
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        if (request.action === 'convoai-data-from-settings'){
          console.log('Requested user data here from settings page ::: ' , request.data); 
          sendResponse({farewell: "goodbye"});
        }
          
      }
    );
  }


  useEffect(() => {
    fetchSessionData();
    console.log(userdata); 
    if (subscriptionId) {
      fetch(`https://aipoool-convoai-backend.onrender.com/api/subscription-details/${subscriptionId}`)
        .then((response) => response.json())
        .then((data) => {
          console.log('Subscription details:', data);
          setSubscriptionDetails(data);
        })
        .catch((error) => console.error('Error fetching subscription details:', error));
    }
  }, [subscriptionId]);

  // Example mapping (adjust based on your actual backend response structure)
  const paymentEmail = subscriptionDetails?.subscriber?.email_address;
  const subscriptionStartDate = subscriptionDetails?.start_time;
  const nextBillingDate = subscriptionDetails?.billing_info?.next_billing_time;
  const amountPaid = subscriptionDetails?.billing_info?.last_payment?.amount?.value;
  const planType = subscriptionDetails?.plan_name;
  const planDescription = subscriptionDetails?.plan_description; 

  // setting the subscription data into the db 


  return (
    <div>
      <h1>Payment Successful</h1>
      <p>Thank you! Your payment has been successfully processed.</p>
      {subscriptionId && (
        <p><strong>Subscription ID:</strong> {subscriptionId}</p>
      )}
      {subscriptionDetails && (
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
