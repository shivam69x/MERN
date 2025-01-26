import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ApproverDashboard = ({ token }) => {
    const [applications, setApplications] = useState([]); // State to hold approved applications
    const [error, setError] = useState(''); // State for error messages
    const [loading, setLoading] = useState(false); // State for loading indicator

    const fetchApprovedApplications = async () => {
        setLoading(true); // Set loading to true when fetching data
        try {
            const response = await axios.get('http://localhost:5000/api/applications/approved', {
                headers: { Authorization: `Bearer ${token}` } // Use the passed token
            });
            console.log('Approved applications fetched:', response.data); // Log the fetched applications
            setApplications(response.data); // Set the approved applications
        } catch (error) {
            console.error('Error fetching approved applications:', error);
            setError('Error fetching approved applications. Please try again later.'); // Handle error state
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    };

    useEffect(() => {
        fetchApprovedApplications();
    }, [token]);

    const handleApprove = async (applicationId) => {
        if (window.confirm('Are you sure you want to approve this application?')) {
            const token = localStorage.getItem('token'); // Retrieve the token again for debugging
            console.log('Token received for approval:', token); // Debugging line
            try {
                await axios.put(`http://localhost:5000/api/applications/${applicationId}/approve`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Application approved successfully.');

                // Remove the approved application from the state
                setApplications((prevApplications) => 
                    prevApplications.filter(app => app._id !== applicationId)
                ); // Update the state to remove the approved application

            } catch (error) {
                console.error('Error approving application:', error);
                setError('Failed to approve application. Please try again later.');
            }
        } 
    };

    const handleReject = async (applicationId) => {
        if (window.confirm('Are you sure you want to reject this application?')) {
            const token = localStorage.getItem('token'); // Retrieve the token again for debugging
            console.log('Token received for rejection:', token); // Debugging line
            try {
                await axios.put(`http://localhost:5000/api/applications/${applicationId}/reject`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Application rejected successfully.');

                // Remove the rejected application from the state
                setApplications((prevApplications) => 
                    prevApplications.filter(app => app._id !== applicationId)
                ); // Update the state to remove the rejected application

            } catch (error) {
                console.error('Error rejecting application:', error);
                setError('Failed to reject application. Please try again later.');
            }
        } 
    };

    const downloadResume = (resumeBuffer) => {
        const blob = new Blob([resumeBuffer.data], { type: 'application/pdf' }); // Adjust the MIME type as necessary
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'resume.pdf'; // Set the default file name
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div>
            <h1>Approved Applications</h1>
            {loading && <p>Loading applications...</p>} {/* Loading indicator */}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {applications.length > 0 ? (
                applications.map(app => (
                    <div key={app._id}>
                        <h3>Application ID: {app._id}</h3>
                        <p>Initiator ID: {app.initiatorId}</p>
                        <p>Status: selected</p> {/* Hardcoded status */}
                        <p>Remarks:</p>
                        <ul>
                            {app.remarks.map((remark, index) => (
                                <li key={index}>{remark.remark}</li>
                            ))}
                        </ul>
                        {/* Approve and Reject buttons */}
                        <button onClick={() => handleApprove(app._id)}>Approve</button>
                        <button onClick={() => handleReject(app._id)}>Reject</button>
                        {/* Download Resume button */}
                        <button onClick={() => downloadResume(app.resume)}>Download Resume</button>
                    </div>
                ))
            ) : (
                <p>No approved applications found.</p> // Message when no approved applications are available
            )}
        </div>
    );
};

export default ApproverDashboard;