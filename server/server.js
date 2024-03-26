const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = 'mongodb://localhost:27017';

async function connectToMongoDB() {
    const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log('Connecté à la base de données MongoDB');

        const database = client.db('React_app');
        const collection = database.collection('cart_items');

        // Exemple de route pour récupérer des données depuis la base de données
        app.get('/api/data', async (req, res) => {
            try {
                const data = await collection.find({}).toArray();
                res.json(data);
            } catch (error) {
                console.error('Erreur lors de la récupération des données depuis MongoDB:', error);
                res.status(500).json({ message: 'Erreur lors de la récupération des données' });
            }
        });

    } catch (error) {
        console.error('Erreur de connexion à la base de données MongoDB:', error);
    }
}

connectToMongoDB();

// Route racine pour vérifier si le serveur est en cours d'exécution
app.get('/', (req, res) => {
    res.send('Le serveur fonctionne correctement');
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
