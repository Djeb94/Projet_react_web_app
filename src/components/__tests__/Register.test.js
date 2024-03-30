// userService.test.js
import { Register } from '../Register.js'; // Importez la fonction à tester depuis votre fichier source
import fetchMock from 'fetch-mock'; // Utilisez fetchMock pour simuler les requêtes HTTP

// Test de la fonction registerUser
describe('Register function', () => {
  afterEach(() => {
    fetchMock.restore(); // Restaurez fetchMock après chaque test
  });

  it('should register a user successfully', async () => {
    // Configurer fetchMock pour simuler une réponse réussie
    fetchMock.post('http://localhost:5000/register', { status: 200 });

    // Appeler la fonction registerUser avec des valeurs d'email et de mot de passe valides
    const result = await Register('test@example.com', 'password');

    // Vérifier que la fonction retourne true après l'inscription réussie
    expect(result).toBe(true);
  });

  it('should handle registration failure', async () => {
    // Configurer fetchMock pour simuler une réponse d'erreur
    fetchMock.post('http://localhost:5000/register', { status: 400 });

    // Appeler la fonction registerUser avec des valeurs d'email et de mot de passe invalides
    const result = await Register('test@example.com', 'password');

    // Vérifier que la fonction retourne false en cas d'échec de l'inscription
    expect(result).toBe(false);
  });
});
