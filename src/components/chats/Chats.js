import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from '../Nav';
import '../../css/style.css';
import Cookies from 'js-cookie';
import { getLoggedInUser } from '../api/apiService';

const Chats = () => {
    const [chatData, setChatData] = useState([]);
    const [message, setMessage] = useState('');
    const [loggedInUser, setLoggedInUser] = useState({});
    const [error, setError] = useState('');
    const token = Cookies.get('token');

    // Fetch logged-in user data when component mounts
    useEffect(() => {        
        const fetchUser = async () => {
            const user = await getLoggedInUser(); // Await the result of the async function
            setLoggedInUser(user);
            fetchChatData();
        };

        fetchUser();
    }, []);

    const fetchChatData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/chats', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch chat data');
            }
            const data = await response.json();
            setChatData(data);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSend = async () => {
        if (message.trim() === '') {
            setError('Please enter a message');
            return;
        }

        const newMessage = {
            user_id: loggedInUser.id, // Use the correct user ID from the fetched data
            message: message,
        };

        try {
            const response = await fetch('http://localhost:5000/api/chats', { 
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newMessage),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            // Refresh chat data after sending message
            fetchChatData();
            setMessage('');
            setError('');
        } catch (error) {
            setError(error.message);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-GB'); // Format: YYYY-MM-DD
        const formattedTime = date.toLocaleTimeString('en-GB', { hour12: false }); // Format: HH:mm:ss
        return `${formattedDate} ${formattedTime}`;
    };

    const handleRefresh = () => {
        fetchChatData();
    };

    return (
        <>
            <Nav />
            <div className="container mt-4">
                <h1 className="text-center mb-4">Group Chat</h1>
                <ul className="list-group mb-3 chat-list">
                    {chatData.map((data, index) => (
                        <li
                            key={index}
                            className={`list-group-item ${data.user_id === loggedInUser.id ? 'text-left bg-chat-light' : 'text-right bg-chat-dark'}`}
                        >   

                            <span>[{formatDate(data.date_time)}] <b>{data.user}</b>:</span> <span>{data.message}</span>
                        </li>
                    ))}
                </ul>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">
                            <b><span>{loggedInUser.name}</span></b>
                        </span>
                    </div>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Type a message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button className="btn btn-primary" id="send-btn" onClick={handleSend}>Send</button>
                    <button className="btn btn-secondary" id="refresh-btn" onClick={handleRefresh}>Refresh</button>
                </div>
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}
            </div>
        </>
    );
};

export default Chats;
