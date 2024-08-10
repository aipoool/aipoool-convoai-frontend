import React from 'react';

const PricingPlan = () => {
  return (
    <div>
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
        </div>
        <div className="plan">
          <h2>Pro</h2>
          <p>$20/month</p>
          <ul>
            <li>Pro Benefit 1</li>
            <li>Pro Benefit 2</li>
            <li>Pro Benefit 3</li>
          </ul>
        </div>
        <div className="plan">
          <h2>Plus</h2>
          <p>$30/month</p>
          <ul>
            <li>Plus Benefit 1</li>
            <li>Plus Benefit 2</li>
            <li>Plus Benefit 3</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PricingPlan;
