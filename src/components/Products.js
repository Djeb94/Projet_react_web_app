// Products.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Products() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/items') // Utilisez l'URL complète avec le port 5000
      .then(response => setItems(response.data))
      .catch(error => console.error('Error fetching items:', error));
  }, []);

  return (
    <div>
      <h2>Products</h2>
      <ul>
        {items.map(item => (
          <li key={item._id}>
            <strong>{item.name}</strong> - ${item.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Products;
