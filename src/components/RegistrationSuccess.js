import React, { useState, useEffect } from 'react';
import axios from 'axios';
/*global chrome*/ 

var extensionId = 'dnjmipaneoddchfeamgdabpiomihncii'; 

function RegistrationSuccess() {
  const [userdata, setUserdata] = useState({});
  const [userjwt, setUserjwt] = useState({});

  const fetchSessionData = async() => {
    try{
      const response = await axios.get("https://aipoool-convoai-backend.onrender.com/auth/login/success", {withCredentials:true});
      setUserdata(response.data.user);
      setUserjwt(response.data.jwtToken); 
      
    }catch(error){ 
      console.log("error", error); 
    }
  }

  useEffect(() => {
    fetchSessionData()
  }, [])

  chrome.runtime.sendMessage(
    extensionId,
    {
      type: "convoai-login-data",
      info: userdata,
      jwtToken: userjwt,
    },
    function (response) {
      if (!response.success) {
        console.log("error sending message", response);
        return response;
      }
    }
  );

  localStorage.setItem('convoaiUserProfData', JSON.stringify(userjwt));


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
