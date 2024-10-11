const mongoose = require('mongoose');

const CvSchema = new mongoose.Schema({
    name: {type: String, required: true},
    firstname: {type: String, required: true, unique: true},
    description: {type: String, required: true},
    educationalExperiences: {type: [String], required: true},
    professionalExperiences: {type: [String], required: true},
    visibility: {type: Boolean, required: true},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
});

module.exports = mongoose.model('Cv', CvSchema);
