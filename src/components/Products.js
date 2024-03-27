import React, { useEffect } from 'react';

function Products() {
    useEffect(() => {
        const token = localStorage.getItem('token'); // Récupérer le token JWT du stockage local

        if (token) {
            // Effectuer une requête GET vers http://localhost:5000/products avec le token JWT dans l'en-tête de la requête
            fetch("http://localhost:5000/products", {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}` // Inclure le token JWT dans l'en-tête de la requête
                },
                
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erreur lors de la récupération des produits");
                }
                return response.json();
            })
            .then(data => {
                // Faire quelque chose avec les données récupérées si nécessaire
                console.log("Produits récupérés :", data);
            })
            .catch(error => {
                console.error("Erreur :", error);
            });
        } else {
            console.error("Unauthorized");
        }
    }, []); // Le tableau vide indique que cet effet ne dépend d'aucune variable, il ne sera donc exécuté qu'une seule fois lors du montage du composant

    return (
        <div>
            <h1>Products</h1>
        </div>
    );
}

export default Products;
