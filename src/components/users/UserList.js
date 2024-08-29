import React, { useState, useEffect } from 'react';
import Nav from '../Nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getLoggedInUser } from '../api/apiService';

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState(null); // State to store logged-in user
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentUserIndex, setCurrentUserIndex] = useState(null);

    const navigate = useNavigate();
    const token = Cookies.get('token'); // Get the token from cookies

    useEffect(() => {
        const fetchLoggedInUser = async () => {
            const user = await getLoggedInUser(); // Fetch logged-in user data
            setLoggedInUser(user);
        };

        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/users', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Use Bearer prefix
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                } else {
                    console.error('Failed to fetch users');
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchLoggedInUser(); // Fetch logged-in user data
        fetchUsers(); // Fetch all users
    }, [token]);

    const handleEdit = (index) => {
        navigate(`/users/edit-user/${users[index].id}`);
    };

    const handleShowDeleteModal = (index) => {
        setShowDeleteModal(true);
        setCurrentUserIndex(index);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setCurrentUserIndex(null);
    };

    const handleDelete = async () => {
        try {
            const userId = users[currentUserIndex].id;
            const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`, // Include token in headers
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const updatedUsers = users.filter((_, index) => index !== currentUserIndex);
                setUsers(updatedUsers);
                handleCloseDeleteModal();
            } else {
                console.error('Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <>
            <Nav />
            <div className="container">
                <h2 className="mt-4">User List</h2>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => handleEdit(index)}
                                    >
                                        Edit
                                    </button>
                                    {/* Conditionally render the delete button */}
                                    {loggedInUser && loggedInUser.id !== user.id && (
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleShowDeleteModal(index)}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete this user?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseDeleteModal}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDelete}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
};

export default UsersList;
