import React, { useState } from 'react';
import './App.css';

function App() {
  // Définition des états pour les valeurs des champs du formulaire
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  // Fonction de soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire
    // Vous pouvez traiter les valeurs des champs ici
    console.log("Password:", password);
    console.log("Email:", email);
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* Formulaire */}
        <form onSubmit={handleSubmit}>
          {/* Champ de saisie pour le nom */}
          <br />
          {/* Champ de saisie pour l'email */}
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <br />
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <br />
          {/* Bouton de soumission */}
          <button type="submit">Soumettre</button>
        </form>
      </header>
    </div>
  );
}

export default App;
