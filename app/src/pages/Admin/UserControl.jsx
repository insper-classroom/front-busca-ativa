import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import HeaderAdmin from './HeaderAdmin';
import './static/UserControl.css';

const cookies = new Cookies();

function UserControl() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const token = cookies.get('token');

    useEffect(() => {
        fetch('http://localhost:8000/usuarios', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            return response.json();
        })
        .then(data => {
            setUsers(data);
        })
        .catch(error => {
            setError(error.message);
        });
    }, [token]);

    const handleDelete = (id) => {
        fetch(`http://localhost:8000/usuarios/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete user');
            }
            setUsers(users.filter(user => user._id !== id));
        })
        .catch(error => {
            setError(error.message);
        });
    };

    return (
        <div>
            <HeaderAdmin />

            <div className="user-control">
                {error && <p>{error}</p>}
                <table>
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Nome</th>
                            <th>Permissão</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.email}</td>
                                <td>{user.nome}</td>
                                <td>{user.permissao}</td>
                                <td>
                                    <button onClick={() => handleDelete(user._id)}>Deletar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UserControl;
