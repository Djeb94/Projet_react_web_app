const express = require('express');
const app = express();
app.get('/', (req, res) => {
    res.send('Bonjour, monde!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
