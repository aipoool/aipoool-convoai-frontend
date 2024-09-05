import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
/*global chrome*/ 

var extensionId = 'dnjmipaneoddchfeamgdabpiomihncii'; 

function RegistrationSuccess() {
  const [userdata, setUserdata] = useState({});
  const [userjwt, setUserjwt] = useState({});

  function hexStringToArrayBuffer(hexString) {
    if (hexString.length % 2 !== 0) {
      throw new Error("Invalid hexString");
    }
    const buffer = new ArrayBuffer(hexString.length / 2);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < hexString.length; i += 2) {
      view[i / 2] = parseInt(hexString.substr(i, 2), 16);
    }
    return buffer;
  }
  
  // Function to derive key material from password
  async function getKeyMaterial(password) {
    const enc = new TextEncoder();
    return window.crypto.subtle.importKey(
      "raw",
      enc.encode(password),
      "PBKDF2",
      false,
      ["deriveKey"]
    );
  }
  
  // Function to derive a key using PBKDF2
  async function deriveKey(keyMaterial, salt) {
    const enc = new TextEncoder();
    const saltBuffer = enc.encode(salt);
    return window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: saltBuffer,
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );
  }
  
  // Function to decrypt the token
  async function decryptToken(encryptedTokenWithIv) {
    const [ivHex, authTagHex, encryptedHex] = encryptedTokenWithIv.split(':');
  
    const iv = hexStringToArrayBuffer(ivHex);
    const authTag = hexStringToArrayBuffer(authTagHex);
    const encrypted = hexStringToArrayBuffer(encryptedHex);
  
    // Combine encrypted data and auth tag
    const ciphertext = new Uint8Array([...new Uint8Array(encrypted), ...new Uint8Array(authTag)]);
  
    // Derive the key using PBKDF2
    const password = "ConvoAI@2096";
    const salt = "ConvoSalty@2096";
  
    const keyMaterial = await getKeyMaterial(password);
    const key = await deriveKey(keyMaterial, salt);
  
    // Decrypt the ciphertext
    try {
      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        key,
        ciphertext
      );
  
      const decoder = new TextDecoder();
      const decryptedToken = decoder.decode(decrypted);
      return decryptedToken;
    } catch (e) {
      console.error("Decryption failed", e);
      throw new Error("Decryption failed");
    }
  }

  function decodeJwtToken(token) {
    try {
      const decoded = jwtDecode(token);
      return decoded;
    } catch (error) {
      console.error("Failed to decode JWT token:", error);
      return null;
    }
  }

  const fetchSessionData = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const encryptedTokenWithIv = urlParams.get('token');

    if (encryptedTokenWithIv) {
      decryptToken(encryptedTokenWithIv)
      .then(async jwtToken => {
        // Decode the token to get the payload data
        console.log("jwtToken", jwtToken);
        setUserjwt(jwtToken);
        const tokenData = decodeJwtToken(jwtToken);
        setUserdata(tokenData);

        // message sent to the extension 
        chrome.runtime.sendMessage(
          extensionId,
          {
            type: "convoai-login-data",
            info: tokenData,
            jwtToken: jwtToken,
          },
          function (response) {
            if (!response.success) {
              console.log("error sending message", response);
              return response;
            }
          }
        );

      })
      .catch(error => {
        console.error("Failed to decrypt token:", error);
      });
    }
  };

  useEffect(() => {
    fetchSessionData()
  }, [])


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
