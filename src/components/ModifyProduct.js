import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../form.css';

function ModifyProducts() {
  const { id } = useParams();
  const [taskName, setTaskName] = useState('');
  const [taskImportance, setTaskImportance] = useState('');
  const [buttonState, setButtonState] = useState({ text: 'Submit', background: 'black' });
  const navigate = useNavigate();

  useEffect(() => {
    // Effectuer une requête pour récupérer les détails de la tâche à partir de l'API
    const fetchTask = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tasks/${id}`);
        console.log(response.data);
        if (response && response.data) {
          const { name, importance } = response.data;
          if (name && importance) {
            setTaskName(name);
            setTaskImportance(importance);
          } else {
            console.error('Task data incomplete');
          }
        } else {
          console.error('No data received from the server');
        }
      } catch (error) {
        console.error('Error fetching task details:', error);
      }
    };
  
    fetchTask(); // Appeler la fonction de récupération de la tâche
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/api/items/${id}`, {
        name: taskName,
        importance: taskImportance
        
      });
      if (response.status === 200) {
        navigate('/products');
        console.log('Task updated successfully');
      } else {
        setButtonState({ text: 'Error', background: 'rgb(250, 67, 60)' });
        setTimeout(() => {
          setButtonState({ text: 'Submit', background: 'black' });
        }, 4000);
        console.error('Error updating task');
      }
    } catch (error) {
      console.error('Error modifying task:', error);
    }
  };

  return (
    <div className="main">
      <div className="logincardcontainer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="logincard">
          <div className="logincardheader">
            <h1>Modify Task</h1>
          </div>
          <form onSubmit={handleSubmit} className="logincardform" noValidate>
            <div className="formitem">
              <span className="material-icons">label</span>
              <input type='text' placeholder='Task Name' value={taskName} onChange={(e) => setTaskName(e.target.value)} autoFocus required />
            </div>
            <div className="formitem">
              <span className="material-icons">device_thermostat</span>
              <select value={taskImportance} onChange={(e) => setTaskImportance(e.target.value)} required>
                <option value="normal">Select Importance :</option>
                <hr />
                <option value="Optional">Optional</option>
                <option value="Normal">Normal</option>
                <option value="Important">Important</option>
                <option value="Priority">Priority</option>
              </select>
            </div>
            <button className="button" type='submit' style={{ background: buttonState.background }}>{buttonState.text}</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ModifyProducts;
