import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({
        username: '',
        name: '',
        email: '',
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const response = await fetch('http://localhost:8000/users');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error loading users:', error);
        }
    };

    const addUser = async () => {
        try {
            await fetch('http://localhost:8000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });
            setNewUser({ username: '', name: '', email: '' });
            loadUsers();
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    const deleteUser = async (id) => {
        try {
            await fetch(`http://localhost:8000/users/${id}`, {
                method: 'DELETE',
            });
            loadUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <div>
            <h1>Система управления пользователями</h1>
            <button onClick={() => setShowModal(true)}>Добавить</button>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                        <h2>Добавить нового пользователя</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                addUser();
                                setShowModal(false);
                            }}
                        >
                            <label>Username:</label>
                            <input
                                type="text"
                                value={newUser.username}
                                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                            />
                            <label>Name:</label>
                            <input
                                type="text"
                                value={newUser.name}
                                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            />
                            <label>Email:</label>
                            <input
                                type="email"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            />
                            <button type="submit">Добавить</button>
                        </form>
                    </div>
                </div>
            )}
            {users.length > 0 ? (
                <table>
                    <thead>
                    <tr>
                        <th>Username</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <button onClick={() => deleteUser(user.id)}>Удалить</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>Лист пуст</p>
            )}
        </div>
    );
};

export default App;
