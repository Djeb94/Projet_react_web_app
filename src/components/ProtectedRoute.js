// ProtectedRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';

function ProtectedRoute({ element, isAuthenticated, ...rest }) {
  if (isAuthenticated) {
    return <Route {...rest} element={element} />;
  } else {
    // Redirigez l'utilisateur vers la page de connexion s'il n'est pas authentifié
    return <Navigate to="/login" />;
  }
}

export default ProtectedRoute;
