import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function ModifyProducts() {
  const { id } = useParams(); // Récupérer l'ID du produit à partir de l'URL
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Effectuer une requête pour récupérer les détails du produit à partir de l'API
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/items/${id}`);
        const { name, price } = response.data;
        setName(name);
        setPrice(price);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProduct(); // Appeler la fonction de récupération du produit
  }, [id]); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/api/items/${id}`, {
        name: name,
        price: price
      });
      console.log(response.data);
      navigate('/products');
      // Réinitialiser les champs du formulaire après la soumission réussie
      setName('');
      setPrice('');
    } catch (error) {
      console.error('Error modifying item:', error);
    }
  };

  return (
    <div className="App">
    <div className="App-header">
      <h2>Modify Product</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="product-name">Name:</label>
        <input
          type="text"
          id="product-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br />
        <label htmlFor="product-price">Price:</label>
        <input
          type="number"
          id="product-price"
          min="0"
          step=".01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <br />
        <button type="submit">Update Product</button>
      </form>
      </div>
    </div>
  );
}

export default ModifyProducts;
