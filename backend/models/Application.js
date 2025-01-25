// models/Application.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const remarkSchema = new Schema({
    remark: { type: String, required: true },
    reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User ' }
});

const applicationSchema = new Schema({
    initiatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User ', required: true },
    reviewers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User ' }],
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    remarks: [remarkSchema], // Array of remarks
    resume: { type: Buffer },
});

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;