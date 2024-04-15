import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../form.css";

export default function Authentication() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [buttonState, setButtonState] = useState({ text: "Sign in", background: "black" });
    const navigate = useNavigate();

    const onSubmit = async (event) => {
        event.preventDefault(); 

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                const { token, username, userId } = data; // Récupérez l'ID de l'utilisateur depuis la réponse JSON
                localStorage.setItem('token', token); // Stocker le token JWT dans le localStorage
                localStorage.setItem('username', username); // Stocker le nom d'utilisateur dans le localStorage
                localStorage.setItem('id', userId); // Stocker l'ID de l'utilisateur dans le localStorage
                console.log('Succes !');
                navigate('/products');
            } else {
                setButtonState({ text: "Incorrect credentials", background: "rgb(250, 67, 60)" });
                setTimeout(() => {
                    setButtonState({ text: "Sign in", background: "black" });
                }, 4000);
            }
        } catch (error) {
            console.error('Fetch Error:', error);
        }
    };
    return (
        <div className="main">
            <div className="logincardcontainer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="logincard">
                    <div className="logincardlogo"></div>
                    <div className="logincardheader">
                        <h1>Login</h1>
                        <div>Log in to use the platform</div>
                    </div>
                    <form onSubmit={onSubmit} method='post' className="logincardform" noValidate>
                        <div className="formitem">
                            <span className="material-icons">mail</span>
                            <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} autoFocus required />
                        </div>
                        <div className="formitem">
                            <span className="material-icons">lock</span>
                            <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <button className="button" type='submit' style={{ background: buttonState.background }}>{buttonState.text}</button>
                    </form>
                    <div className="logincardfooter">
                        <font style={{ fontSize: 'large' }}>
                        Don't have an account? <a href='./register'>Create one!</a>
                        </font>
                    </div>
                </div>
            </div>
        </div>
    );
}
