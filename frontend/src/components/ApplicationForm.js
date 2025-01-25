// src/components/ApplicationForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const ApplicationForm = () => {
    const [details, setDetails] = useState('');
    const [resume, setResume] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('details', details);
        formData.append('resume', resume);

        try {
            await axios.post('http://localhost:5000/api/applications', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Set content type for file upload
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            // Redirect to UserProfile after successful submission
            navigate('/profile'); // Redirect to User Profile
        } catch (err) {
            setError('Application submission failed. Please try again.');
            console.error('Error submitting application:', err); // Log the error for debugging
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Submit Application</h2>
            <textarea 
                placeholder="Details" 
                onChange={(e) => setDetails(e.target.value)} 
                required 
            />
            <input 
                type="file" 
                onChange={(e) => setResume(e.target.files[0])} 
                required 
            />
            <button type="submit">Submit</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
};

export default ApplicationForm;