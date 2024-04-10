import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../form.css';

function AddTask() {
  const [taskName, setTaskName] = useState('');
  const [taskImportance, setTaskImportance] = useState('normal');
  const [taskNameValid, setTaskNameValid] = useState(true);
  const [buttonState, setButtonState] = useState({ text: 'Submit', background: 'black' });
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('id');
    if (!userId) {
      // Gérer le cas où l'ID de l'utilisateur n'est pas disponible
      console.error("User ID not found in local storage");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérification du nom de la tâche
    if (taskName.trim() === '') {
      setTaskNameValid(false);
    } else {
      setTaskNameValid(true);
    }

    // Vérification si le champ est rempli
    if (taskName.trim() === '') {
      setTaskNameValid(false);
      setButtonState({ text: 'Task name cannot be empty', background: 'rgb(250, 67, 60)' });
      setTimeout(() => {
        setButtonState({ text: 'Submit', background: 'black' });
      }, 4000);
      return;
    }

    // Si le champ est invalide, ne pas soumettre le formulaire
    if (!taskNameValid) {
      setButtonState({ text: 'Invalid task name', background: 'rgb(250, 67, 60)' });
      setTimeout(() => {
        setButtonState({ text: 'Submit', background: 'black' });
      }, 4000);
      return;
    }

    try {
      // Récupérer l'ID de l'utilisateur depuis le local storage
      const userId = localStorage.getItem('id');

      // Soumettre le formulaire avec l'ID de l'utilisateur
      const response = await fetch('http://localhost:5000/addTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: taskName, importance: taskImportance, userId }),
      });

      if (response.ok) {
        navigate('/products');
        console.log('Task added successfully');
      } else {
        setButtonState({ text: 'Error', background: 'rgb(250, 67, 60)' });
        setTimeout(() => {
          setButtonState({ text: 'Submit', background: 'black' });
        }, 4000);
        console.error('Error adding task');
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <div className="main">
      <div className="logincardcontainer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="logincard">
          <div className="logincardlogo"></div>
          <div className="logincardheader">
            <h1>Add Task</h1>
            <div>Add a new task to the list</div>
          </div>
          <form onSubmit={handleSubmit} method='post' className="logincardform" noValidate>
            <div className="formitem">
              <span className="material-icons">label</span>
              <input type='text' placeholder='Task Name' value={taskName} onChange={(e) => setTaskName(e.target.value)} autoFocus required />
            </div>
            <div className="formitem">
              <span class="material-icons">device_thermostat</span>
              <select value={taskImportance} onChange={(e) => setTaskImportance(e.target.value)} required>
                <option value=""> Select Importance :</option>
                <hr />
                <option value="Not important">Not important</option>
                <option value="Can wait">Can wait</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            <button className="button" type='submit' style={{ background: buttonState.background }}>{buttonState.text}</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddTask;
