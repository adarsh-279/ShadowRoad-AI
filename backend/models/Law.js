const mongoose = require('mongoose');

const LawSchema = new mongoose.Schema({
    category: { type: String, required: true },
    icon: { type: String, default: '📋' },
    title: { type: String, required: true },
    section: { type: String, required: true },
    fine: { type: String },
    description: { type: String, required: true },
    penalty: { type: String, required: true },
    isDanger: { type: Boolean, default: false }
});

module.exports = mongoose.model('Law', LawSchema);
