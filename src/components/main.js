// Main.js
import React from 'react';
import { Link } from 'react-router-dom';

function Main() {
  return (
    <div>
      <h1>Main page</h1>
      <Link to="/authentication"><button>Login</button></Link>
      <Link to="/register"><button>Register</button></Link>
    </div>
  );
}

export default Main;
