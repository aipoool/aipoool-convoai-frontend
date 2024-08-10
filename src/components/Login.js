import React from 'react';

function Login() {

  const handleGoogleLogin = () => {
    window.open('https://aipoool-convoai-backend.onrender.com/auth/google/callback', '_self');
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>

      <button onClick={handleGoogleLogin} style={styles.googleButton}>
        Login with Google
      </button>
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
  },
  label: {
    marginBottom: '15px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
  googleButton: {
    marginTop: '20px',
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#db4437', // Google's brand color
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
};

export default Login;
