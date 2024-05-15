const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db.js');
const { Mentor, Student } = require('./schema');
const cors = require ("cors");


const app = express();
const PORT =  4000;

app.use(bodyParser.json());
app.use(cors());

// API routes
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

app.post('/mentors', async (req, res) => {
  try {
    const { name } = req.body;
    const mentor = await Mentor.create({ name });
    res.status(201).json(mentor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/students', async (req, res) => {
  try {
    const { name, mentorId } = req.body;
    const student = await Student.create({ name, mentor: mentorId });
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/mentors/:mentorId/students', async (req, res) => {
  try {
    const { mentorId } = req.params;
    const { studentId } = req.body;
    const mentor = await Mentor.findById(mentorId); 
    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found' });
    }
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    mentor.students.push(student);
    await mentor.save();
    res.status(200).json(mentor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/students/:studentId/mentor', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { mentorId } = req.body;
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    student.mentor = mentorId;
    await student.save();
    res.status(200).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/mentors/:mentorId/students', async (req, res) => {
  try {
    const { mentorId } = req.params;
    const mentor = await Mentor.findById(mentorId).populate('students');
    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found' });
    }
    res.status(200).json(mentor.students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/students/:studentId/previous-mentor', async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId).populate('mentor');
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.status(200).json(student.mentor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});