const mongoose = require('mongoose');   //ok
const Schema = mongoose.Schema;

const educationSchema = new mongoose.Schema({
  type: String,
  university: String,
  degree: String,
  start: String,
  end: String
});

// Define the schema for resume data
const ResumeSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  personalInfo: {
    firstName: String,
    lastName: String,
    email: String,
    mobile: String,
    profilePic: String,
    address1: String,
    address2: String,
    city: String,
    state: String,
    pin: String,
    objective: String,
  },
  workEx: [
    {
      title: String,
      orgName: String,
      startYear: String,
      endYear: String,
      jobDescription: String,
    }
  ],
  education: [educationSchema], 
  skills: [
    {
      skillName: String,
    }
  ],
});

// Create the model using the schema
const Resume = mongoose.model('Resume', ResumeSchema);

module.exports = Resume;