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

    if (importance === 'optional') {
      return 'optional';
    } else if (importance === 'important') {
      return 'important';
    } else if (importance === 'priority') {
      return 'priority';
    } else if (importance === 'normal') {
      return 'normal';
     } else {
      return '';
    }
  };

  const getTaskClassName = (isActive) => {
    return isActive ? '' : 'task-inactive';
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

  const handleDoneClick = async (taskId) => {
    try {
      // Envoyer une requête PUT à l'API pour mettre à jour l'état "active" de la tâche
      const response = await axios.put(`http://localhost:5000/api/tasks/state/${taskId}`);
      if (response.status === 200) {
        // Mettre à jour l'état local des tâches pour refléter le changement
        setItems(prevItems => {
          return prevItems.map(item => {
            if (item._id === taskId) {
              // Mettre à jour l'état "active" de la tâche actuelle à false
              return { ...item, active: false };
            }
            return item;
          });
        });
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <div>
      <Header />
      <div className='products-div'>
      <div className='tasks-menu'>
      <h2 id='MyTasks'>My Tasks</h2>
        <Link to="/addProduct">
          <button id='add'><div id='add-div'><span className="material-icons" id='add-icons'>add</span>Add task</div></button>
        </Link>
        
        </div>
        <ul>
          {items.map(item => (
            <li key={item._id}>
            <strong className={getTaskClassName(item.active)}>{item.name}</strong> <button className={`importance ${getImportanceClass(item.importance)}`} id={getTaskClassName(item.active)}>{item.importance}</button>
            <button id='delete' onClick={() => handleDelete(item._id)}><span className="material-icons">delete</span></button>
              <Link to={`/modifyProduct/${item._id}`}>
                <button id='edit'><span className="material-icons">edit</span></button>
              </Link>
              
              <button id='done'  onClick={() => handleDoneClick(item._id)}><span class="material-icons">done</span></button>
              <hr id='hr-tasks'></hr>
            </li>
           
          ))}
          
        </ul>
      </div>
    </div>
  );
}

export default Products;
