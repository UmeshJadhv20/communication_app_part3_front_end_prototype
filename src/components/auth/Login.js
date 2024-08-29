import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/apiService';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    const validateForm = () => {
        let formErrors = {};

        if (!formData.email) {
            formErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            formErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            formErrors.password = 'Password is required';
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
           
            // let users = JSON.parse(localStorage.getItem('users')) || [];
            // const user = users.find(user => user.email === formData.email && user.password === formData.password);

            // if (user) {
            //     localStorage.removeItem("loggedUser");
            //     localStorage.setItem("loggedUser", JSON.stringify({ id: user.id, name: user.name, email: user.email }));
            //     navigate('/login-success');
            // } else {
            //     setErrors({ login: 'Email or password is incorrect' });
            // }
            

            try {
                const response = await loginUser({ email: formData.email, password: formData.password });
                if (response.token) {
                  document.cookie = `token=${response.token}; path=/;`;
                  console.log('Login successful!');
                  navigate('/login-success');
                } else {
                    console.log(response.message || 'Login failed.');
                    setErrors({ login: 'Email or password is incorrect' });
                }
              } catch (error) {
                console.error('Error logging in:', error);
                console.log('Login failed. Please try again.');
              }
        }
    };

    return (
        <>           
            <div className="container mt-5">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            id="email" 
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                        {errors.email && <div className="text-danger">{errors.email}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            id="password" 
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                        {errors.password && <div className="text-danger">{errors.password}</div>}
                    </div>
                    {errors.login && <div className="text-danger">{errors.login}</div>}
                    <button type="submit" className="btn btn-primary">Login</button>
                </form>
            </div>
        </>
    );
};

export default Login;
