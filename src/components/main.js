// Main.js
import React from 'react';
import '../main.css';
import { Link } from 'react-router-dom';

function Main() {
  return (
    <div id='w-div'>
    <h1>Welcome to our <mark>fullstack app</mark></h1>
    <div id='main-div'>
      
      <Link to="/authentication"><button id='login'>Login</button></Link>
      <Link to="/register"><button id='register'>Register</button></Link>
    </div>
    </div>
  );
}

export default Main;
