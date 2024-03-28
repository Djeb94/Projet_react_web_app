// Authentication.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function Authentication() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const { token } = data;
        localStorage.setItem('token', token); // Stockez le token JWT dans le localStorage
        console.log('Authentification réussie');
        navigate('/products'); // Redirigez vers la page protégée
      } else {
        console.error('Échec de l\'authentification');
      }
    } catch (error) {
      console.error('Erreur lors de l\'authentification:', error);
    }
  };

  return (
    <div className='App'>
    <div className="App-header">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
      <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
      <p>No account ? <a href='http://localhost:3000/register'>register here</a></p>
      </div>

    </div>
  );
}

export default Authentication;
