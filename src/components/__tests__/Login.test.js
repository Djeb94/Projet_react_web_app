// Importer les modules nécessaires
const { expect } = require('chai');
const fetch = require('node-fetch'); // Assurez-vous que node-fetch est installé
const fetchMock = require('fetch-mock');

// Importer la fonction de login à tester
const { Authentication } = require('../Authentication.js');

// Décrire les tests d'intégration pour le processus de connexion
describe('Login Process', () => {
  afterEach(() => {
    fetchMock.restore(); // Restaurer fetchMock après chaque test
  });

  it('should login successfully and receive token', async () => {
    // Configurer fetchMock pour simuler une réponse réussie avec un jeton
    fetchMock.post('http://localhost:5000/login', { token: 'example_token' });

    // Appeler la fonction Authentication avec des identifiants valides
    const response = await Authentication('valid_user', 'valid_password');

    // Vérifier que la fonction retourne le jeton attendu
    expect(response.token).to.equal('example_token');
  });

  it('should handle login failure', async () => {
    // Configurer fetchMock pour simuler une réponse d'erreur
    fetchMock.post('http://localhost:5000/login', 401);

    // Appeler la fonction Authentication avec des identifiants invalides
    const response = await Authentication('invalid_user', 'invalid_password');

    // Vérifier que la fonction retourne une erreur ou un statut 401 non autorisé
    expect(response.status).to.equal(401);
  });
});
