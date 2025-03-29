// Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        username: '',
        password: '',
        email: ''
    });  

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.firstname || !formData.lastname || !formData.username || 
            !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all fields');
        return;
        }

        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.code === 201) {
            console.log('successful registration:', data);
            // Store token in localStorage for authentication
            localStorage.setItem('authToken', data.data.token);
            localStorage.setItem('userId', data.data.userId);
            localStorage.setItem('username', data.data.username);
            // Redirect to login page
            navigate('/login');

        } else {
            console.log('Registration failed:', data);
        }
    }

    return (
        <div className="register-page">
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    First Name:
                    <input
                        type="text"
                        id="firstname"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                        placeholder="Enter your first name"
            />
                </label>
                <label>
                    Last Name:
                    <input
                        type="text"
                        id="lastname"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        placeholder="Enter your last name" />
                </label>

                <label>
                    Username:
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Enter your username" />
                </label>
                <label>
                    Password:
                    <input 
                        type="password" 
                        name="password" 
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter a password" />
                </label>
                <label>
                    Email:
                    <input 
                        type="email" 
                        name="email" 
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter a valid email" />
                </label>
                <button type="submit">Register</button>
            </form>
        </div>

    )


}

export default Register;


// what does e.preventDefault(); do?