const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = 'mongodb://localhost:27017';

let collection = null;

async function connectToMongoDB() {
    const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log('Connecté à la base de données MongoDB');
        const database = client.db('React_app');
        collection = database.collection('Users');
    } catch (error) {
        console.error('Erreur de connexion à la base de données MongoDB:', error);
    }
}

connectToMongoDB();

app.use(bodyParser.json());

// Middleware pour autoriser les requêtes CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/', (req, res) => {
    res.send('Le serveur fonctionne correctement');
});

app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        await collection.insertOne({ email, password });
        res.status(201).json({ message: 'Utilisateur enregistré avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur lors de l\'enregistrement de l\'utilisateur' });
    }
});

// Middleware pour gérer les requêtes OPTIONS
app.options('*', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.send();
});

app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
