import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Importez Routes au lieu de Switch
import {Fragment} from 'react';
import Register from './components/Register';
import Authentication from './components/Authentication';
import Products from './components/Products';
import NotFound from './components/NotFound';
import Main from './components/main';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Fragment>
        <Routes> {/* Utilisez Routes au lieu de Switch */}
          <Route path="/" element={<Main />} /> {/* Utilisez element au lieu de component */}
          <Route path="/authentication" element={<Authentication />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute/>}>
            <Route exact path='/products' element={<Products/>}/>
          </Route>
          <Route path="*" element={<NotFound />} /> {/* Utilisez * pour gérer toutes les routes inconnues */}
        </Routes>
        </Fragment>
    </Router>
  );
}

export default App;
