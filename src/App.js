import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Pages/Login';
import RegistrationSuccess from './Pages/RegistrationSuccess';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registration-success" element={<RegistrationSuccess />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
