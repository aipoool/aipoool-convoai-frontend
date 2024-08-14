import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import RegistrationSuccess from './components/RegistrationSuccess';
import PricingPlan from './components/PricingPlan';
import PaymentSuccess from './components/Success';
import PaymentFailed from './components/Failed';
import CancelSubscription from './components/CancelSubscription';
import ChangeSubscription from './components/ChangeSubscription';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registration-success" element={<RegistrationSuccess />} />
        <Route path="/pricing" element={<PricingPlan />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
        <Route path="/unsubscribe" element={<CancelSubscription />} />
        <Route path="/change-in-plans" element={<ChangeSubscription />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
