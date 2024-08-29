import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getLoggedInUser } from '../api/apiService';

const EditUser = () => {
    const { id } = useParams(); 
    const navigate = useNavigate(); 
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [fullnameError, setFullnameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [loggedInUser, setLoggedInUser] = useState(null); // State to store the logged-in user

    useEffect(() => {
        // Fetch the logged-in user data
        const fetchLoggedInUser = async () => {
            const user = await getLoggedInUser(); // Fetch logged-in user data
            setLoggedInUser(user); // Update state
        };

        fetchLoggedInUser(); // Call to fetch logged-in user
    }, []); // Empty dependency array ensures this runs once on mount

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = Cookies.get('token'); // Get the token from cookies
                const response = await fetch(`http://localhost:5000/api/users/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Include token in headers
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const user = await response.json();
                    setFullname(user.name);
                    setEmail(user.email);
                } else {
                    console.error('Failed to fetch user');
                    navigate('/users');
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                navigate('/users');
            }
        };

        fetchUser(); 
    }, [id, navigate]); // Dependency array with id and navigate ensures this runs when id changes

    const handleSaveChanges = async (e) => {
        e.preventDefault();

        let formErrors = {};

        if (!fullname) {
            formErrors.fullname = 'Please enter your fullname.';
        }

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            formErrors.email = 'Please enter a valid email address.';
        }

        setFullnameError(formErrors.fullname);
        setEmailError(formErrors.email);

        if (Object.keys(formErrors).length === 0) {
            try {
                const token = Cookies.get('token'); // Get the token from cookies
                const response = await fetch(`http://localhost:5000/api/users/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Include token in headers
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: fullname, email: email }),
                });

                if (response.ok) {
                    navigate('/users');
                } else {
                    console.error('Failed to update user');
                }
            } catch (error) {
                console.error('Error updating user:', error);
            }
        }
    };

    return (
        <div className="container">
            <div className="mt-5">
                <div className="card">
                    <div className="card-header">
                        Edit User Information
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSaveChanges} className="needs-validation" noValidate>
                            <div className="mb-3">
                                <label htmlFor="fullname" className="form-label">Fullname</label>
                                <input 
                                    type="text" 
                                    className={`form-control ${fullnameError ? 'is-invalid' : ''}`} 
                                    id="fullname"  
                                    value={fullname}
                                    onChange={(e) => setFullname(e.target.value)}  
                                />
                                {fullnameError && <div className="invalid-feedback">{fullnameError}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    type="email"
                                    className={`form-control ${emailError ? 'is-invalid' : ''}`}
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loggedInUser && loggedInUser.id == parseInt(id)} // Properly checks logged-in user
                                />
                                {emailError && <div className="invalid-feedback">{emailError}</div>}
                            </div>
                            <button type="submit" className="btn btn-primary">Save</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditUser;
