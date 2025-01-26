import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ApproverDashboard = ({ token }) => {
    const [applications, setApplications] = useState([]); // State to hold applications
    const [error, setError] = useState(''); // State for error messages

    const fetchApprovedApplications = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/applications/approved', {
                headers: { Authorization: `Bearer ${token}` } // Use the passed token
            });
            console.log('Approved applications fetched:', response.data); // Log the fetched applications
            setApplications(response.data); // Set the approved applications
        } catch (error) {
            console.error('Error fetching approved applications:', error);
            setError('Error fetching approved applications'); // Handle error state
        }
    };

    useEffect(() => {
        fetchApprovedApplications();
    }, [token]);

    const handleApprove = async (applicationId) => {
        try {
            await axios.put(`http://localhost:5000/api/applications/${applicationId}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` } // Include the token in the header
            });
            alert('Application approved successfully.');
            fetchApprovedApplications(); // Refresh the applications list after approval
        } catch (error) {
            console.error('Error approving application:', error);
            setError('Failed to approve application.');
        }
    };

    const handleReject = async (applicationId) => {
        try {
            await axios.put(`http://localhost:5000/api/applications/${applicationId}/reject`, {}, {
                headers: { Authorization: `Bearer ${token}` } // Include the token in the header
            });
            alert('Application rejected successfully.');
            fetchApprovedApplications(); // Refresh the applications list after rejection
        } catch (error) {
            console.error('Error rejecting application:', error);
            setError('Failed to reject application.');
        }
    };

    return (
        <div>
            <h1>Approver Dashboard</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {applications.length > 0 ? (
                applications.map(app => (
                    <div key={app._id}>
                        <h3>Application ID: {app._id}</h3>
                        <button onClick={() => handleApprove(app._id)}>Approve</button>
                        <button onClick={() => handleReject(app._id)}>Reject</button>
                    </div>
                ))
            ) : (
                <p>No applications to review.</p>
            )}
        </div>
    );
};

export default ApproverDashboard;