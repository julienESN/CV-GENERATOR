/* eslint-disable no-undef */
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const CvSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  name: { type: String, required: true },
  firstname: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: false },
  address: { type: String, required: false },
  website: { type: String, required: false },
  summary: { type: String, required: false },
  description: { type: String, required: true },
  skills: { type: [String], required: false },
  languages: { type: [String], required: false },
  certifications: { type: [String], required: false },
  interests: { type: [String], required: false },
  educationalExperiences: { type: [String], required: true },
  professionalExperiences: { type: [String], required: true },
  visibility: { type: Boolean, required: true },
  userId: { type: String, ref: 'User', required: true },
});

module.exports = mongoose.model('Cv', CvSchema);
