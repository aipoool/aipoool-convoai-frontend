import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import RegistrationSuccess from './components/RegistrationSuccess';
import PricingPlan from './components/PricingPlan';
import PaymentSuccess from './components/Success';
import PaymentFailed from './components/Failed';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registration-success" element={<RegistrationSuccess />} />
        <Route path="/pricing" element={<PricingPlan />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
