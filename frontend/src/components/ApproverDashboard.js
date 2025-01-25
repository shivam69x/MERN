// src/components/ApproverDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ApproverDashboard = ({ token }) => {
    const [applications, setApplications] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/applications/approved', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setApplications(response.data);
            } catch (error) {
                console.error('Error fetching approved applications:', error);
                setError('Failed to load approved applications.');
            }
        };

        fetchApplications();
    }, [token]);

    const handleApprove = async (applicationId) => {
        try {
            await axios.put(`http://localhost:5000/api/applications/${applicationId}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Refresh the applications list after approval
            setApplications(applications.filter(app => app._id !== applicationId));
            alert('Application approved successfully.');
        } catch (error) {
            console.error('Error approving application:', error);
            setError('Failed to approve application.');
        }
    };

    const handleReject = async (applicationId) => {
        try {
            await axios.put(`http://localhost:5000/api/applications/${applicationId}/reject`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Refresh the applications list after rejection
            setApplications(applications.filter(app => app._id !== applicationId));
            alert('Application rejected successfully.');
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
                        <p>{app.details}</p>
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