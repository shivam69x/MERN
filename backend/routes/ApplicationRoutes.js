// routes/ApplicationRoutes.js
const express = require('express');
const router = express.Router();
const Application = require('../models/Application'); // Your Application model
const authMiddleware = require('../middleware/auth'); // Your auth middleware


// Send application to approver
router.put('/:id/send-to-approver', authMiddleware, async (req, res) => {
    console.log("gggh")
    
    try {
        const application = await Application.findById(req.params.id);
        if (!application) return res.status(404).json({ message: 'Application not found' });

        // Update application status and add remark
        application.status = 'pending approval'; // Update status
        application.remarks.push({ remark: req.body.remark, reviewerId: req.user.id }); // Add remark
        await application.save();
        res.status(200).json({ message: 'Application sent to approver' });
    } catch (error) {
        console.error('Error sending application to approver:', error);
        res.status(500).json({ message: 'Error processing request' });
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
router.put('/:id/approve', authMiddleware, async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) return res.status(404).json({ message: 'Application not found' });

        // Check if the user is an approver
        if (req.user.role !== 'approver') {
            return res.status(403).json({ message: 'You are not authorized to approve this application.' });
        }

        application.status = 'approved'; // Update status
        application.approverId = req.user.id; // Store the approver's ID
        await application.save();

        res.status(200).json({ message: 'Application approved successfully', application });
    } catch (error) {
        console.error('Error approving application:', error);
        res.status(500).json({ message: 'Error processing request' });
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

// Export the router
module.exports = router;