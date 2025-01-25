// src/components/UserProfile.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserProfile = () => {
    const [user, setUser ] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    // Correctly define the fetchUser  function
    const fetchUser  = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/user/profile', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setUser (response.data);
        } catch (err) {
            setError('Error fetching user profile');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser (); // Call the function to fetch user profile
    }, []);

    if (loading) {
        return <p>Loading user profile...</p>; // Loading message
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>; // Error message
    }

    return (
        <div>
            <h1>User Profile</h1>
            {user ? (
                <div>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    {/* Add other user details as needed */}
                </div>
            ) : (
                <p>No user data available.</p>
            )}
        </div>
    );
};

export default UserProfile;