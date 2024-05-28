import React from 'react';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';

const cookies = new Cookies();

const Logout = () => {
    const navigate = useNavigate();
    const token = cookies.get('token');

    const handleLogout = (e) => {
        e.preventDefault();

        fetch('http://localhost:8000/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ token: token })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to logout');
            }
            cookies.remove('token', { path: '/' });
            navigate('/login');
        })
        .catch(error => {
            console.error('Error logging out:', error);
        });
    };

    return (
        <button className="logout-button" variant='danger' onClick={handleLogout}>
            Logout
        </button>
    );
};

export default Logout;
