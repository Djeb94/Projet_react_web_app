const express = require('express');
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = "mongodb+srv://gaeldjebar:RgT2t4KKgG8IkIhH@cluster0.vuwmomm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" // Utiliser l'URI de connexion à partir des variables d'environnement

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
        const { username, email, password } = req.body;
        const usersCollection = client.db('ToDoDB').collection('users');
        
        // Générer un hachage sécurisé du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Stocker le nom d'utilisateur, l'e-mail et le mot de passe haché dans la base de données
        const result = await usersCollection.insertOne({ username, email, password: hashedPassword });
        
        const insertedId = result.insertedId; // Récupérer l'ID de l'utilisateur nouvellement créé

        res.status(201).json({ message: 'Utilisateur enregistré avec succès', userId: insertedId }); // Renvoyer l'ID de l'utilisateur
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur lors de l\'enregistrement de l\'utilisateur' });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Vérifier les informations d'authentification dans la base de données
    const usersCollection = client.db('ToDoDB').collection('users');
    const user = await usersCollection.findOne({ email });

    if (user) {
        // Comparer le mot de passe fourni avec le mot de passe haché stocké dans la base de données
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            // Authentification réussie
            const token = jwt.sign({ email: user.email, userId: user._id }, 'votre_clé_secrète', { expiresIn: '1h' });
            res.status(200).json({ message: 'Authentification réussie', token, username: user.username, userId: user._id }); // Renvoyer également l'ID de l'utilisateur
        } else {
            // Mot de passe incorrect
            res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }
    } else {
        // Utilisateur non trouvé
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

app.get('/api/items/:userId', async (req, res) => {
    const userId = req.params.userId; // Récupérer l'userId depuis les paramètres de l'URL
    const collection = client.db('ToDoDB').collection('tasks');
    try {
        // Filtrer les tâches en fonction de l'userId
        const products = await collection.find({ userId: userId }).toArray();
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});




  
app.post('/addTask', async (req, res) => {
    try {
        const { name, importance, userId } = req.body; // Ajoutez userId à partir du corps de la requête
        const itemCollection = client.db('ToDoDB').collection('tasks');
        // Ajoutez la valeur booléenne "active" à true pour indiquer que la tâche est active
        await itemCollection.insertOne({ name, importance, userId, active: true }); 
        res.status(201).json({ message: 'Tâche créée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la création de la tâche :', error);
        res.status(500).json({ message: 'Erreur lors de la création de la tâche' });
    }
});



app.delete('/api/items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Accédez à la collection "cart-items"
        const collection = client.db('ToDoDB').collection('tasks');
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
        const { name, importance } = req.body;

        const collection = client.db('ToDoDB').collection('tasks');

        // Mettez à jour la tâche avec l'ID spécifié
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { name, importance } }
        );

        // Vérifiez si la tâche a été mise à jour avec succès
        if (result.matchedCount === 1) {
            res.status(200).json({ message: 'Task updated successfully' });
        } else {
            res.status(404).json({ error: 'Task not found' });
        }
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/tasks/:taskId', async (req, res) => {
    const taskId = req.params.taskId; // Récupérer l'ID de la tâche depuis les paramètres de l'URL
    const collection = client.db('ToDoDB').collection('tasks');
    try {
        // Rechercher la tâche en fonction de son ID
        const task = await collection.findOne({ _id: new ObjectId(taskId) });
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json(task);
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/tasks/state/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const collection = client.db('ToDoDB').collection('tasks');
        // Mettre à jour la tâche avec l'ID spécifié pour définir active à false
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { active: false } }
        );
        // Vérifiez si la tâche a été mise à jour avec succès
        if (result.matchedCount === 1) {
            res.status(200).json({ message: 'Task status updated successfully' });
        } else {
            res.status(404).json({ error: 'Task not found' });
        }
    } catch (error) {
        console.error('Error updating task status:', error);
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
