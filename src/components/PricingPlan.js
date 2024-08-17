import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/PricingPlan.css';
/*global chrome*/ 

const PricingPlan = () => {

  const [userdata, setUserdata] = useState({}); 

  const fetchSessionData = async () => {
    try {
      const storedToken = localStorage.getItem('convoaiUserProfData');
      if (storedToken) {
        const userToken = JSON.parse(storedToken);
        console.log('Retrieved user data from settings page:', userToken);
        const secureToken = `${userToken}c0Nv0AI`;
        setUserdata(secureToken);
        
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
        {
          headers: {
            Authorization: `Bearer ${userdata}`, // Send the token in the Authorization header
          },
          withCredentials: true, // Include credentials if necessary (cookies, etc.)
        }
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
          <h2>Starter Spark</h2>
          <p>$10/month</p>
          <ul>
            <li>Benefit 1</li>
            <li>Benefit 2</li>
            <li>Benefit 3</li>
          </ul>
          <button 
            className="select-plan-btn" 
            onClick={() => handleSelectPlan('Basic Plan' , 'P-62X84022270738141M3AEMJQ')}
          >
            Select Plan

          </button>
        </div>
        <div className="plan">
          <h2>Pro Pulse</h2>
          <p>$12/month</p>
          <ul>
            <li>Benefit 1</li>
            <li>Benefit 2</li>
            <li>Benefit 3</li>
          </ul>
          <button 
            className="select-plan-btn" 
            onClick={() => handleSelectPlan('Pro Plan' , 'P-18M17441WN664934YM3AERVY')}
          >
            Select Plan
          </button>
        </div>
        <div className="plan">
          <h2>Elite Edge</h2>
          <p>$15/month</p>
          <ul>
            <li>Plus Benefit 1</li>
            <li>Plus Benefit 2</li>
            <li>Plus Benefit 3</li>
          </ul>
          <button 
            className="select-plan-btn" 
            onClick={() => handleSelectPlan('Plus Plan' , 'P-1BH78296YM9583120M3AETKI')}
          >
            Select Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingPlan;
