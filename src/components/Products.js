import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from "./header";
import { Link } from 'react-router-dom';

import '../products.css';

function Products() {
  const [items, setItems] = useState([]);
  

  useEffect(() => {
    const userId = localStorage.getItem('id');
    // Effectuer une requête GET pour récupérer les tâches de l'utilisateur spécifié par l'id
    axios.get(`http://localhost:5000/api/items/${userId}`)
      .then(response => setItems(response.data))
      .catch(error => console.error('Error fetching items:', error));
  }, []);// Utiliser un tableau vide comme dépendance pour effectuer la requête une seule fois lors du chargement initial

  // Fonction pour supprimer une tâche
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/items/${id}`);

      if (response.status === 200) {
        // Rafraîchir la liste des tâches après la suppression
        const updatedItems = items.filter(item => item._id !== id);
        setItems(updatedItems);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div>
      <Header />
      <div className='products-div'>

        <Link to="/addProduct">
          <button id='add'><div id='add-div'><span class="material-icons" id='add-icons'>add</span>Add products</div></button>
        </Link>
        <h2>Products</h2>

        <ul>
          {items.map(item => (
            <li key={item._id}>
              <strong>{item.name}</strong> - ${item.price}
              <Link to={`/modifyProduct/${item._id}`}>
                <button id='edit'><span class="material-icons">edit</span></button>
              </Link>
              <button id='delete' onClick={() => handleDelete(item._id)}><span class="material-icons">delete</span></button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Products;
