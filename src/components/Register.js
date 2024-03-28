import React, { useState } from 'react';
import '../App.css';

function Login() { // Renommez App en Login
  const [password, setPassword] = useState(''); 
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        
      });
      
      if (response.ok) {
        console.log('Utilisateur enregistré avec succès');
        window.location.href = 'http://localhost:3000/';
      } else {
        console.error('Erreur lors de l\'enregistrement de l\'utilisateur');
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de l\'utilisateur:', error);
    } 
      console.log('invalide data')
   
  } ;

  return (
    <div className="App">
      <header className="App-header">
      <h2>Register</h2>
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
          <button type="submit">Submit</button>
        </form>
        <p>Already an account ? <a href='http://localhost:3000/authentication'>Login here</a></p>
      </header>
    </div>
  );
}

export default Login; // Modifier l'export pour correspondre au nom du composant
