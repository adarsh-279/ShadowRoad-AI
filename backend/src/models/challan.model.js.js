const mongoose = require('mongoose');

const ChallanSchema = new mongoose.Schema({
    zone: { type: String, required: true },
    speed: { type: Number, required: true },
    limit: { type: Number, required: true },
    fineAmount: { type: Number, required: true },
    violations: [{ type: String }],
    helmet: { type: Boolean, default: true },
    issuedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Challan', ChallanSchema);
