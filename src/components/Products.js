import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

import '../products.css';

function Products() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  useEffect(() => {
    axios.get('http://localhost:5000/api/items')
      .then(response => setItems(response.data))
      .catch(error => console.error('Error fetching items:', error));
  }, []);

  // Fonction pour supprimer un article
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/items/${id}`);

      if (response.status === 200) {
        // Rafraîchir la liste des articles après la suppression
        const updatedItems = items.filter(item => item._id !== id);
        setItems(updatedItems);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className='products-div'>
      <button onClick={handleLogout} id='disconnect'>Disconnect</button>
      <Link to="/addProduct">
        <button id='add'>Add products</button>
      </Link>
      <h2>Products</h2>
      
      <ul>
        {items.map(item => (
          <li key={item._id}>
            <strong>{item.name}</strong> - ${item.price} 
            <Link to={`/modifyProduct/${item._id}`}>
            <button id='edit'>Edit</button> 
            </Link>
            <button id='delete' onClick={() => handleDelete(item._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Products;
