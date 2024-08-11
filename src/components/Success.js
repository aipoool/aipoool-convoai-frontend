import React from 'react';

// Utility function to extract query parameters
const useQuery = () => {
  return new URLSearchParams(window.location.search);
};

const PaymentSuccess = () => {
  const query = useQuery();
  const subscriptionId = query.get('subscription_id');
  const productName = query.get('product_name');

  return (
    <div>
      <h1>Payment Successful</h1>
      <p>Thank you! Your payment has been successfully processed.</p>
      {subscriptionId && (
        <p><strong>Subscription ID:</strong> {subscriptionId}</p>
      )}
      {productName && (
        <p><strong>Product Name:</strong> {productName}</p>
      )}
    </div>
  );
};

export default PaymentSuccess;
