// // src/components/ReviewerDashboard.js
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const ReviewerDashboard = ({ token }) => {
//     const [applications, setApplications] = useState([]);
//     const [selectedApplicationId, setSelectedApplicationId] = useState(null);
//     const [remark, setRemark] = useState('');
//     const [error, setError] = useState('');

//     useEffect(() => {
//         const fetchApplications = async () => {
//             try {
//                 const response = await axios.get('http://localhost:5000/api/applications', {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 setApplications(response.data);
//             } catch (error) {
//                 console.error('Error fetching applications:', error);
//                 setError('Failed to load applications.');
//             }
//         };

//         fetchApplications();
//     }, [token]);

//     const handleReview = async (applicationId, isSelected) => {
//         try {
//             if (isSelected) {
//                 // Send to approver
//                 await axios.put(`http://localhost:5000/api/applications/${applicationId}/send-to-approver`, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 alert('Application sent to approver.');
//             } else {
//                 // Provide remark
//                 await axios.put(`http://localhost:5000/api/applications/${applicationId}/remark`, {
//                     remark,
//                 }, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 alert('Remark submitted to user.');
//             }
//             // Refresh applications after action
//             const response = await axios.get('http://localhost:5000/api/applications', {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setApplications(response.data);
//             setSelectedApplicationId(null);
//             setRemark('');
//         } catch (error) {
//             console.error('Error handling review:', error);
//             setError('Failed to process review.');
//         }
//     };

//     return (
//         <div>
//             <h1>Reviewer Dashboard</h1>
//             {error && <p style={{ color: 'red' }}>{error}</p>}
//             {applications.length > 0 ? (
//                 applications.map(app => (
//                     <div key={app._id}>
//                         <h3>Application ID: {app._id}</h3>
//                         <p>{app.details}</p>
//                         <button onClick={() => {
//                             setSelectedApplicationId(app._id);
//                             handleReview(app._id, true); // Send to approver
//                         }}>Send to Approver</button>
//                         <button onClick={() => {
//                             setSelectedApplicationId(app._id);
//                             handleReview(app._id, false); // Provide remark
//                         }}>Provide Remark</button>
//                         {selectedApplicationId === app._id && (
//                             <div>
//                                 <textarea 
//                                     value={remark} 
//                                     onChange={(e) => setRemark(e.target.value)} 
//                                     placeholder="Enter remark" 
//                                 />
//                                 <button onClick={() => handleReview(app._id, false)}>Submit Remark</button>
//                             </div>
//                         )}
//                     </div>
//                 ))
//             ) : (
//                 <p>No applications to review.</p>
//             )}
//         </div>
//     );
// };

// export default ReviewerDashboard;