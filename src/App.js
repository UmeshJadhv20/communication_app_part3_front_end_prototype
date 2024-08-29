// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './components/Welcome';
import Register from './components/auth/Register';
import RegistrationSuccess from './components/auth/RegistrationSuccess';
import Login from './components/auth/Login';
import LoginSuccess from './components/auth/LoginSuccess';
import UserList from './components/users/UserList';
import Documents from './components/documents/Documents';
import Chats from './components/chats/Chats';
import PrivateRoute from './components/auth/PrivateRoute';
import EditUser from './components/users/EditUser';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/registration-success" element={<RegistrationSuccess />} />
                <Route path="/login-success" element={<LoginSuccess />} />
                <Route path="/users" element={<UserList />} />
                <Route path="/users/edit-user/:id" element={<EditUser/>} />
                <Route path="/documents" element={<Documents/>} />
                <Route path="/chats" element={<Chats/>} />
            </Routes>
        </Router>
    );
}

export default App;
