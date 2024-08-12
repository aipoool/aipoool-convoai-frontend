import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/PricingPlan.css';
/*global chrome*/ 

const PricingPlan = () => {

  const [userdata, setUserdata] = useState({}); 

  const fetchSessionData = async () => {
    try {
      const storedData = localStorage.getItem('convoaiUserProfData');
      if (storedData) {
        const userData = JSON.parse(storedData);
        console.log('Retrieved user data from settings page:', userData);
        
        // Handle the user data as needed
        // Optionally, clear the data after use
        localStorage.removeItem('convoaiUserProfData');
        console.log('User data removed from localStorage');
      } else {
        console.log('No user data found in localStorage');
      }
    } catch (error) {
      console.error('Error fetching session data:', error);
    }
  };

  const handleSelectPlan = async (planType, planId) => {
    console.log(`Going for ${planType} plan with id ${planId}`);

    try {
      const response = await axios.post(
        "https://aipoool-convoai-backend.onrender.com/api/subscribe",
        { planId }, // Sending planId in the request body
        { withCredentials: true } // Including credentials in the request
      );

      if (response.data && response.data.paypalUrl) {
        window.location.href = response.data.paypalUrl; // Redirect to PayPal URL
      }
  
      console.log("Subscription successful", response.data.paypalUrl);
      
    } catch (error) {
      console.error("Error during subscription:", error);
    }
  };

  useEffect(() => {
    fetchSessionData();
  });

  return (
    <div className="pricing-page">
      <h1>Pricing Plans</h1>
      <div className="pricing-table">
        <div className="plan">
          <h2>Basic</h2>
          <p>$10/month</p>
          <ul>
            <li>Basic Benefit 1</li>
            <li>Basic Benefit 2</li>
            <li>Basic Benefit 3</li>
          </ul>
          <button 
            className="select-plan-btn" 
            onClick={() => handleSelectPlan('Basic' , 'P-55M42500U43143339M23Z5TI')}
          >
            Select Plan
          </button>
        </div>
        <div className="plan">
          <h2>Pro</h2>
          <p>$20/month</p>
          <ul>
            <li>Pro Benefit 1</li>
            <li>Pro Benefit 2</li>
            <li>Pro Benefit 3</li>
          </ul>
          <button 
            className="select-plan-btn" 
            onClick={() => handleSelectPlan('Pro' , 'P-2DE39443D4956545AM23Z7GY')}
          >
            Select Plan
          </button>
        </div>
        <div className="plan">
          <h2>Plus</h2>
          <p>$30/month</p>
          <ul>
            <li>Plus Benefit 1</li>
            <li>Plus Benefit 2</li>
            <li>Plus Benefit 3</li>
          </ul>
          <button 
            className="select-plan-btn" 
            onClick={() => handleSelectPlan('Plus' , 'P-5BJ936829D7221634M23Z56Y')}
          >
            Select Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingPlan;
