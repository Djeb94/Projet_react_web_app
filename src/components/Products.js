// Products.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../products.css';

function Products() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate(); // Déplacez useNavigate à l'intérieur de Products

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    // Videz le localStorage
    localStorage.removeItem('token');
    // Redirigez l'utilisateur vers la page d'authentification
    navigate('/authentication');
  };

  useEffect(() => {
    axios.get('http://localhost:5000/api/items') // Utilisez l'URL complète avec le port 5000
      .then(response => setItems(response.data))
      .catch(error => console.error('Error fetching items:', error));
  }, []);

  return (
    <div className='products-div'>
      <button onClick={handleLogout} id='disconnect'>Disconnect</button>
      <button id='add'>Add products</button>
      <h2>Products</h2>
      
      <ul>
        {items.map(item => (
          <li key={item._id}>
            <strong>{item.name}</strong> - ${item.price} <button id='edit'>Edit</button> <button id='delete'>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Products;
