import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from "./header";
import { Link } from 'react-router-dom';

import '../products.css';

function Products() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem('id');

    axios.get(`http://localhost:5000/api/items/${userId}`)
      .then(response => setItems(response.data))
      .catch(error => console.error('Error fetching items:', error));
  }, []);

  const getImportanceClass = (importance) => {
    importance = importance.toLowerCase(); // Convertir en minuscules pour ignorer la casse

    if (importance === 'not important') {
      return 'not-important';
    } else if (importance === 'can wait') {
      return 'can-wait';
    } else if (importance === 'urgent') {
      return 'urgent';
    } else if (importance === 'normal') {
      return 'normal';
     } else {
      return '';
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/items/${id}`);

      if (response.status === 200) {
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
          <button id='add'><div id='add-div'><span className="material-icons" id='add-icons'>add</span>Add task</div></button>
        </Link>
        <h2>My Tasks</h2>
        <ul>
          {items.map(item => (
            <li key={item._id}>
            <button className={`importance ${getImportanceClass(item.importance)}`}>{item.importance}</button><strong>{item.name}</strong> 
            <button id='delete' onClick={() => handleDelete(item._id)}><span className="material-icons">delete</span></button>
              <Link to={`/modifyProduct/${item._id}`}>
                <button id='edit'><span className="material-icons">edit</span></button>
              </Link>
              
              <hr id='hr-tasks'></hr>
            </li>
           
          ))}
          
        </ul>
      </div>
    </div>
  );
}

export default Products;
