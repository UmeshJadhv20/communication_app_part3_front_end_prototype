import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/apiService';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirm_password: '',
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    
    const validateEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    const validateForm = () => {
        let formErrors = {};

        if (!formData.name) {
            formErrors.name = 'Full Name is required';
        }

        if (!formData.email) {
            formErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            formErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            formErrors.password = 'Password is required';
        }

        if (!formData.confirm_password) {
            formErrors.confirm_password = 'Confirm Password is required';
        } else if (formData.password !== formData.confirm_password) {
            formErrors.confirm_password = 'Passwords do not match';
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
            let users = JSON.parse(localStorage.getItem('users')) || [];
            const userExists = users.some(user => user.email === formData.email);
            if (userExists) {
                setErrors({...errors, email: 'Email already exists'});
            }else{
               

                // let { name, email, password } = formData;
                // let user = {
                //     id: Number(new Date()),
                //     name: name,
                //     email: email,
                //     password: password
                // }               

                // users.push(user);               
                // localStorage.setItem('users', JSON.stringify(users));

                try {
                    // Call the registerUser API function
                    const response = await registerUser(formData);
                   
                                
                    if (response.token) {
                      // Store the token in localStorage                      
                      console.log('User registered successfully!');
                    } else {
                        console.log(response.message || 'Registration failed.');
                    }
                  } catch (error) {
                    console.error('Error registering user:', error);
                    // setMessage('Registration failed. Please try again.');
                  }
               

                
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    confirm_password: '',
                });
                setErrors({});

              //  navigate('/registration-success');

            }
           
            
        }
    };

    return (
        <>
        <div className="container mt-5">
            <h2>Register</h2>
            <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="name" 
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                    {errors.name && <div className="text-danger">{errors.name}</div>}
                </div>
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
                <div className="mb-3">
                    <label htmlFor="confirm_password" className="form-label">Confirm Password</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        id="confirm_password" 
                        value={formData.confirm_password}
                        onChange={handleInputChange}
                    />
                    {errors.confirm_password && <div className="text-danger">{errors.confirm_password}</div>}
                </div>
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
        </div>
        </>
    );
};

export default Register;
