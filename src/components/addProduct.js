import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddProduct() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/addProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, price }),
      });

      if (response.ok) {
        navigate('/products');
        console.log('Produit ajouté avec succès');

        // Faire quelque chose en cas de succès, par exemple rediriger l'utilisateur
      } else {
        console.error('Erreur lors de l\'ajout du produit');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Add Product</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <br />
          <label>
            Price:
            <input
              type="number"
              min="0"
              step=".01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </label>
          <br />
          <button type="submit">Submit</button>
        </form>
      </header>
    </div>
  );
}

export default AddProduct;
