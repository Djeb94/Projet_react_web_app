import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../form.css';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [buttonState, setButtonState] = useState({ text: "Register", background: "black" });
    const navigate = useNavigate();

    const onSubmit = async (event) => {
        event.preventDefault();

        // Validation des champs
        if (!username || !email || !password || !confirmPassword) {
            setButtonState({ text: "Please fill in all the fields.", background: "rgb(250, 67, 60)" });
            setTimeout(() => {
                setButtonState({ text: "Sign in", background: "black" });
            }, 4000);
            return;
        }

        if (password !== confirmPassword) {
            setButtonState({ text: "The entered passwords do not match.", background: "rgb(250, 67, 60)" });
            setTimeout(() => {
                setButtonState({ text: "Register", background: "black" });
            }, 4000);
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password,
                })
            });

            if (response.ok) {
                const data = await response.json();
                const { token, userId } = data;
                localStorage.setItem('username', username);
                localStorage.setItem('token', token);
                localStorage.setItem('id', userId);
                console.log('Success!');
                navigate('/products');
            } else {
                throw new Error('Error submitting the form.');
            }
        } catch (error) {
            console.error('Fetch Error:', error);
            setButtonState({ text: "Error during registration.", background: "rgb(250, 67, 60)" });
            setTimeout(() => {
                setButtonState({ text: "Sign in", background: "black" });
            }, 4000);
        }
    };

    return (
        <div className="main">
            <div className="logincardcontainer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="logincard">
                    <div className="logincardlogo"></div>
                    <div className="logincardheader">
                        <h1>Registration</h1>
                        <div>Create an account to use the platform.</div>
                    </div>
                    <form onSubmit={onSubmit} method='post' className="logincardform" noValidate>
                        <div className="formitem">
                            <span className="material-icons">chevron_right</span>
                            <input type="text" id="name" name="name" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </div>
                        <div className="formitem">
                            <span className="material-icons">mail</span>
                            <input type="email" placeholder="Email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
                        </div>
                        <div className="formitem">
                            <span className="material-icons">lock</span>
                            <input type='password' placeholder='Password' id='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div className="formitem">
                            <span className="material-icons">lock</span>
                            <input type='password' placeholder='Confirm password' id='confirm_password' name="confirm_password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        </div>
                        <button className="button" type='submit' style={{ background: buttonState.background }}>{buttonState.text}</button>
                    </form>
                    <div className="logincardfooter">
                        <font style={{ fontSize: 'large' }}>
                            <p>Already have an account ? <a href='http://localhost:3000/authentication'>Login here</a></p>
                        </font>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
