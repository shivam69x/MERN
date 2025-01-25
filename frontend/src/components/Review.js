// src/components/Review.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Review = () => {
    const [applications, setApplications] = useState([]); // State to hold applications
    const [selectedApplication, setSelectedApplication] = useState(null); // State for the selected application
    const [remark, setRemark] = useState(''); // State for the remark input
    const [status, setStatus] = useState(''); // State for the selected action (selected/unselected)
    const [error, setError] = useState(''); // State for error messages
    const [loading, setLoading] = useState(true); // Loading state

    // Fetch applications when the component mounts
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/applications', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setApplications(response.data); // Set applications from the response
            } catch (err) {
                setError('Error fetching applications'); // Set error message if fetching fails
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchApplications();
    }, []);

    // Handle review submission
    const handleReview = async (applicationId) => {
        try {
            if (status === 'selected') {
                // Send to approver
                await axios.put(`http://localhost:5000/api/applications/${applicationId}/send-to-approver`, {
                    remark
                }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
            } else if (status === 'unselected') {
                // Provide remark to user
                await axios.put(`http://localhost:5000/api/applications/${applicationId}/remark`, {
                    remark
                }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
            }

            // Remove the reviewed application from the state
            setApplications(applications.filter(app => app._id !== applicationId));

            // Clear the form
            setRemark('');
            setStatus('');
            setSelectedApplication(null);
        } catch (err) {
            if (err.response && err.response.status === 403) {
                setError('You do not have permission to perform this action.'); // Handle permission error
            } else {
                setError('Error submitting review'); // Handle other errors
            }
        }
    };

    // Loading state
    if (loading) {
        return <p>Loading applications...</p>; // Loading message
    }

    return (
        <div>
            <h1>Review Applications</h1>
            {applications.length > 0 ? (
                applications.map(app => (
                    <div key={app._id}>
                        <h3>Application ID: {app._id}</h3>
                        <p>{app.details}</p> {/* Display application details */}
                        <button onClick={() => setSelectedApplication(app)}>Review</button>
                    </div>
                ))
            ) : (
                <p>No applications to review</p> // Message when no applications are available
            )}
            {selectedApplication && (
                <div>
                    <h2>Review Application ID: {selectedApplication._id}</h2>
                    <textarea 
                        value={remark} 
                        onChange={(e) => setRemark(e.target.value)} 
                        placeholder="Enter remark" 
                    />
                    <select onChange={(e) => setStatus(e.target.value)} value={status}>
                        <option value="">Select Action</option>
                        <option value="selected">Select (Send to Approver)</option>
                        <option value="unselected">Unselect (Provide Remark)</option>
                    </select>
                    <button onClick={() => handleReview(selectedApplication._id)}>Submit Review</button>
                </div>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
        </div>
    );
};

export default Review;