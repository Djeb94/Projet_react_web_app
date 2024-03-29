const express = require('express');
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = 'mongodb://localhost:27017';

let client = null;

async function connectToMongoDB() {
    client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log('Connecté à la base de données MongoDB');
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
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // Ajoutez 'Authorization' ici
    next();
});


app.get('/', (req, res) => {
    res.send('Le serveur fonctionne correctement');
});

app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const usersCollection = client.db('React_app').collection('Users');
        await usersCollection.insertOne({ email, password });
        res.status(201).json({ message: 'Utilisateur enregistré avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur lors de l\'enregistrement de l\'utilisateur' });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Vérifier les informations d'authentification dans la base de données
    const usersCollection = client.db('React_app').collection('Users');
    const user = await usersCollection.findOne({ email, password });

    if (user) {
        // Authentification réussie
        const token = jwt.sign({ email: user.email, userId: user._id }, 'votre_clé_secrète', { expiresIn: '1h' });
        res.status(200).json({ message: 'Authentification réussie', token });
        console.log(token);

    } else {
        // Échec de l'authentification
        res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
});


app.get('/products', (req, res) => {
    // Récupérer le token JWT depuis l'en-tête de la requête
    const token = req.headers.authorization;

    if (token) {
        // Vérifier et décoder le token JWT
        jwt.verify(token, 'votre_clé_secrète', (err, decoded) => {
            if (err) {
                // Le token est invalide
                return res.status(401).json({ message: 'Token JWT invalide' });
            } else {
                // Le token est valide, autoriser l'accès à la page "Products"
                res.status(200).json({ message: 'Accès autorisé à la page Products' });
            }
        });
    } else {
        // Le token JWT est manquant dans l'en-tête de la requête
        res.status(401).json({ message: 'Token JWT manquant dans l\'en-tête de la requête' });
    }
});

app.get('/api/items', async (req, res) => {
    const database = client.db('React_app');
      const collection = database.collection('cart_items');
    try {
      
      const products = await collection.find({}, { projection: { id: 1, name: 1, price: 1 } }).toArray();
  
      
      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  
  app.post('/addProduct', async (req, res) => {
    try {
        const { name, price } = req.body;
        const itemCollection = client.db('React_app').collection('cart_items');
        await itemCollection.insertOne({ name, price });
        res.status(201).json({ message: 'Produit creer' });
    } catch (error) {
        console.error('Erreur lors de la creation du produits:', error);
        res.status(500).json({ message: 'Erreur lors de la creation du produits' });
    }
});

app.delete('/api/items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Accédez à la collection "cart-items"
        const collection = client.db('React_app').collection('cart_items');
        // Supprimez l'article avec l'ID spécifié
        const result = await collection.deleteOne({ _id: new ObjectId(id) }); // Utilisez new ObjectId(id)
        // Vérifiez si l'article a été supprimé avec succès
        if (result.deletedCount === 1) {
            res.status(200).json({ message: 'Article deleted successfully' });
        } else {
            res.status(404).json({ error: 'Article not found' });
        }
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price } = req.body;

        // Accédez à la collection "cart-items"
        const collection = client.db('React_app').collection('cart_items');

        // Mettez à jour l'article avec l'ID spécifié
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { name, price } }
        );

        // Vérifiez si l'article a été mis à jour avec succès
        if (result.matchedCount === 1) {
            res.status(200).json({ message: 'Article updated successfully' });
        } else {
            res.status(404).json({ error: 'Article not found' });
        }
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ error: 'Internal server error' });
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
