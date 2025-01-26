const express = require('express');
const multer = require('multer');
const router = express.Router();
const Application = require('../models/Application'); // Import your Application model
const authMiddleware = require('../middleware/auth'); // Import your auth middleware

// Set up multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

// Create a new application
router.post('/', authMiddleware, upload.single('resume'), async (req, res) => {
    const userId = req.user.id; // Get the user ID from the auth middleware

    // Check if a file was uploaded
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }


    const application = new Application({
        initiatorId: userId, // Store the initiator's ID
        resume: req.file.buffer, // Access the file buffer
        status: 'pending', // Initial status
        reviewers: [], // Initialize reviewers array
        remarks: [] // Initialize remarks array
    });

    try {
        await application.save();
        res.status(201).json({ message: 'Application submitted successfully', application });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all applications for a user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const applications = await Application.find({ initiatorId: req.user.id }).populate('initiatorId', 'username');
        res.status(200).json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


router.put('/:id/send-to-approver', authMiddleware, async (req, res) => {
    console.log("Request Body:", req.body); // Log the request body
    const { remark } = req.body; // Only get the remark from the request body

    try {
        const application = await Application.findById(req.params.id);
        if (!application) return res.status(404).json({ message: 'Application not found' });

        // Update application status and add remark
        application.status = 'pending approval'; // Update status
        application.remarks.push({ remark, reviewerId: req.user.id }); // Add remark
        await application.save();
        res.status(200).json({ message: 'Application sent to approver' });
    } catch (error) {
        console.error('Error sending application to approver:', error);
        res.status(500).json({ message: 'Error processing request', error: error.message });
    }
});
// Provide remark
router.put('/:id/remark', authMiddleware, async (req, res) => {
    const { remark } = req.body;
    try {
        const application = await Application.findById(req.params.id);
        if (!application) return res.status(404).json({ message: 'Application not found' });

        // Add remark to the application
        application.remarks.push({ remark, reviewerId: req.user.id }); // Add remark
        application.status = 'unselected'; // Update status
        await application.save();
        res.status(200).json({ message: 'Remark submitted to user' });
    } catch (error) {
        console.error('Error providing remark:', error);
        res.status(500).json({ message: 'Error processing request' });
    }
});

// Approve application
// In your ApplicationRoutes.js
router.put('/:id/approve', authMiddleware, async (req, res) => {
    const reviewerId = req.user._id;
    console.log('Approving application by reviewer ID:', reviewerId);
    try {
        const application = await Application.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }
        application.status = 'approved';
        if (!application.reviewers.includes(reviewerId)) {
                     application.reviewers.push(reviewerId);
                  } // Update the status to approved
        await application.save(); // Save the changes
        res.status(200).json({ message: 'Application approved successfully' });
    } catch (error) {
        console.error('Error approving application:', error);
        res.status(500).json({ message: 'Error approving application' });
    }
});
// Reject application
router.put('/:id/reject', authMiddleware, async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) return res.status(404).json({ message: 'Application not found' });

        // Check if the user is an approver
        if (req.user.role !== 'approver') {
            return res.status(403).json({ message: 'You are not authorized to reject this application.' });
        }

        application.status = 'rejected'; // Update status
        application.approverId = req.user.id; // Store the approver's ID
        await application.save();

        res.status(200).json({ message: 'Application rejected successfully', application });
    } catch (error) {
        console.error('Error rejecting application:', error);
        res.status(500).json({ message: 'Error processing request' });
    }
});
// In your Approver's route
router.get('/pending', authMiddleware, async (req, res) => {
    try {
        const pendingApplications = await Application.find({ status: 'pending approval' });
        console.log('Pending applications found:', pendingApplications); // Log the found applications
        res.status(200).json(pendingApplications);
    } catch (error) {
        console.error('Error fetching pending applications:', error);
        res.status(500).json({ message: 'Error fetching pending applications' });
    }
});
// Route to get approved applications
router.get('/approved', async (req, res) => {
    try {
        const approvedApplications = await Application.find({ status: 'approved' });
        console.log('Approved applications found:', approvedApplications); 
        res.status(200).json(approvedApplications);
    } catch (error) {
        console.error('Error fetching approved applications:', error);
        res.status(500).json({ message: 'Error fetching approved applications' });
    }
});

// Export the router
module.exports = router;