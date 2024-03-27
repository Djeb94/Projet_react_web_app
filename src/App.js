import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Importez Routes au lieu de Switch
import Register from './components/Register';
import Authentication from './components/Authentication';
import Products from './components/Products';
import NotFound from './components/NotFound';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes> {/* Utilisez Routes au lieu de Switch */}
          <Route path="/" element={<Register />} /> {/* Utilisez element au lieu de component */}
          <Route path="/authentication" element={<Authentication />} />
          <Route path="/products" element={<Products />} />
          <Route path="*" element={<NotFound />} /> {/* Utilisez * pour gérer toutes les routes inconnues */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
