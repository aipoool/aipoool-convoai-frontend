import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RegistrationSuccess() {
  const [userdata, setUserdata] = useState({});

  const fetchSessionData = async() => {
    try{
      const response = await axios.get("https://aipoool-convoai-backend.onrender.com/api/login/success", {withCredentials:true});
      setUserdata(response.data.User);
      
    }catch(error){ 
      console.log("error", error); 
    }
  }

  useEffect(() => {
    fetchSessionData()
    console.log('The data received at the frontend is: ', userdata);
  }, [])


  return (
    <div style={styles.container}>
      <h2>Registration Successful</h2>
      <p>You have successfully registered. Please log in to continue.</p>
      <a href="/login" style={styles.link}>Go to Login</a>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  link: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    marginTop: '20px',
  },
};

export default RegistrationSuccess;
