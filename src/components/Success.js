import React, { useEffect, useState } from 'react';

const useQuery = () => {
  return new URLSearchParams(window.location.search);
};

const PaymentSuccess = () => {
  const query = useQuery();
  const subscriptionId = query.get('subscription_id');
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);

  useEffect(() => {
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

  return (
    <div>
      <h1>Payment Successful</h1>
      <p>Thank you! Your payment has been successfully processed.</p>
      {subscriptionId && (
        <p><strong>Subscription ID:</strong> {subscriptionId}</p>
      )}
      {subscriptionDetails && (
        <div>
          <p><strong>Subscription Details:</strong></p>
          <pre>{JSON.stringify(subscriptionDetails, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
