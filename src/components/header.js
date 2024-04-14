import React, { useEffect, useState } from 'react';
import "../header.css";
import { useNavigate } from 'react-router-dom';

function Header() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');

    useEffect(() => {
        // Récupérer le nom d'utilisateur depuis le localStorage lors du chargement du composant
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('id'); 
        navigate('/');
    };

    return (
        <header>
            <nav>
                <ul>
                    <li><a href="/products">My Tasks</a></li>
                    <li><a href="/products">About us</a></li>
                    <li><a href="/products">Contact</a></li>
                    {username && <li> <strong>Welcome {username},</strong></li>} {/* Afficher le nom d'utilisateur s'il existe */}
                    <li id='list-button'><button onClick={handleLogout} id='disconnect'>Disconnect</button></li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;
