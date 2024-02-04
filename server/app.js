import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import {
  createStudent,
  createProfessor,
  createProgramIncharge,
  createAdmin,
  createCourse,
  createMCQQuestion,
  createCodeQuestion,
  createExam,
  createResult,
  createAppeal,

  getStudent,
  getProfessor,
  getProgramIncharge,
  getAdmin,
  getCourse,
  getMCQQuestion,
  getCodeQuestion,
  getExam,
  getResult,
  getAppeal,

  updateStudent,
  updateProfessor,
  updateProgramIncharge,
  updateAdmin,
  updateCourse,
  updateMCQQuestion,
  updateCodeQuestion,
  updateExam,
  updateResult,
  updateAppeal,

  deleteStudent,
  deleteProfessor,
  deleteProgramIncharge,
  deleteAdmin,
  deleteCourse,
  deleteMCQQuestion,
  deleteCodeQuestion,
  deleteExam,
  deleteResult,
  deleteAppeal,
  getStudents,
  getAllStudents,
  getAllProgramIncharges,
  getAllProfessors,
  getAllAdmins,
  getAllCourses,
} from './database.js';

dotenv.config();

const PORT = process.env.PORT || 8080;
const app = express();

// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true
// }));
app.use(cors());
app.use(express.json());




// Protected route that requires JWT authentication
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ success: true, message: 'Protected route accessed successfully.', data: req.user });
});
app.get('/api/protected/:id', authenticateToken, (req, res) => {
  if (req.user.type !== "admin" && req.user.username != req.params.username) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  res.json({ success: true, message: 'Protected route accessed successfully.', data: req.user });
});

// Middleware to authenticate JWT
function authenticateToken(req, res, next) {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    req.user = user;
    next();
  });
}



// login student and get JWT
app.post('/api/student/login', async (req, res) => {
  const result = await getStudent({ username: req.body.username });
  if (result.success) {
    const hashed_password = result.data.password;
    const passwordMatch = await bcrypt.compare(req.body.password, hashed_password);
    if (passwordMatch) {
      // Generate a JWT
      const token = jwt.sign({
        username: req.body.username,
        _id: result.data._id,
        type: "student"
      }, process.env.ACCESS_TOKEN_SECRET);
      res.status(200).json({ token });
    } else {
      res.status(400).send({ message: "Incorrect password" });
    }
  } else {
    res.status(400).send(result);
  }
});

// login professor and get JWT
app.post('/api/professor/login', async (req, res) => {
  const result = await getProfessor({ username: req.body.username });
  if (result.success) {
    const hashed_password = result.data.password;
    const passwordMatch = await bcrypt.compare(req.body.password, hashed_password);
    if (passwordMatch) {
      // Generate a JWT
      const token = jwt.sign({
        username: req.body.username,
        _id: result.data._id,
        type: "professor"
      }, process.env.ACCESS_TOKEN_SECRET);
      res.status(200).json({ token });
    } else {
      res.status(400).send({ message: "Incorrect password" });
    }
  } else {
    res.status(400).send(result);
  }
});

// login program incharge and get JWT
app.post('/api/program-incharge/login', async (req, res) => {
  const result = await getProgramIncharge({ username: req.body.username });
  if (result.success) {
    const hashed_password = result.data.password;
    const passwordMatch = await bcrypt.compare(req.body.password, hashed_password);
    if (passwordMatch) {
      // Generate a JWT
      const token = jwt.sign({
        username: req.body.username,
        _id: result.data._id,
        type: "program-incharge"
      }, process.env.ACCESS_TOKEN_SECRET);
      res.status(200).json({ token });
    } else {
      res.status(400).send({ message: "Incorrect password" });
    }
  } else {
    res.status(400).send(result);
  }
});

// login admin and get JWT
app.post('/api/admin/login', async (req, res) => {
  const result = await getAdmin({ username: req.body.username });
  if (result.success) {
    const hashed_password = result.data.password;
    const passwordMatch = await bcrypt.compare(req.body.password, hashed_password);
    if (passwordMatch) {
      // Generate a JWT
      const token = jwt.sign({
        username: req.body.username,
        _id: result.data._id,
        type: "admin"
      }, process.env.ACCESS_TOKEN_SECRET);
      res.status(200).json({ token });
    } else {
      res.status(400).send({ message: "Incorrect password" });
    }
  } else {
    res.status(400).send(result);
  }
});



// create student
app.post('/api/student', authenticateToken, async (req, res) => {
  if (req.user.type !== "admin") {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  if (!req.body.password) {
    req.body.password = "123456";
  }
  try {
    const studentInfo = {
      enrolledCourseIds: [],
      pastEnrolledCourses: [],
      performance: {
        semesterPerformance: [],
        overallPerformance: {
          totalExamsAttended: 0,
          totalMaxMarks: 0,
          totalMarksScored: 0
        }
      },
      ...req.body,
      password: await bcrypt.hash(req.body.password, 10)
    }
    const result = await createStudent(studentInfo);
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// get student by username
app.get('/api/student/:username', authenticateToken, async (req, res) => {
  if (!(["admin", "program-incharge", "professor"].includes(req.user.type)) && req.user.username != req.params.username) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  try {
    const result = await getStudent({ username: req.params.username });
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// get all students
app.get('/api/students', authenticateToken, async (req, res) => {
  if (!(["admin", "program-incharge", "professor"].includes(req.user.type))) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  try {
    const students = await getAllStudents();
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// update student by student id
app.put('/api/student/:studentId', authenticateToken, async (req, res) => {
  if (!(["admin", "program-incharge"].includes(req.user.type)) && req.user._id != req.params.studentId) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  try {
    const studentInfo = {
      ...req.body,
      // update password if provided
      ...(req.body.password && { password: await bcrypt.hash(req.body.password, 10) })
    }
    const result = await updateStudent({ _id: req.params.studentId }, studentInfo);
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// delete student by student id
app.delete('/api/student/:studentId', authenticateToken, async (req, res) => {
  if (req.user.type !== "admin") {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  try {
    const result = await deleteStudent({ _id: req.params.studentId });
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (err) {

    res.status(400).json({ success: false, message: err.message });
  }
});



// create professor
app.post('/api/professor', authenticateToken, async (req, res) => {
  if (req.user.type !== "admin") {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  if (!req.body.password) {
    req.body.password = "123456";
  }
  try {
    const professorInfo = {
      ...req.body,
      password: await bcrypt.hash(req.body.password, 10)
    }
    const result = await createProfessor(professorInfo);
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// get professor by username
app.get('/api/professor/:username', authenticateToken, async (req, res) => {
  if (!(["admin", "program-incharge", "professor"].includes(req.user.type))) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  try {
    const result = await getProfessor({ username: req.params.username });
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// get all professors
app.get('/api/professors', authenticateToken, async (req, res) => {
  if (!(["admin", "program-incharge", "professor"].includes(req.user.type))) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  try {
    const professors = await getAllProfessors();
    res.status(200).json(professors);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// update professor by professor id
app.put('/api/professor/:professorId', authenticateToken, async (req, res) => {
  if (!(["admin", "program-incharge"].includes(req.user.type)) && req.user._id != req.params.professorId) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  try {
    const professorInfo = {
      ...req.body,
      // update password if provided
      ...(req.body.password && { password: await bcrypt.hash(req.body.password, 10) })
    }
    const result = await updateProfessor({ _id: req.params.professorId }, professorInfo);
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }

  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// delete professor by username
app.delete('/api/professor/:username', authenticateToken, async (req, res) => {
  if (req.user.type !== "admin") {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  try {
    const result = await deleteProfessor({ username: req.params.username });
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});



// create program incharge
app.post('/api/program-incharge', authenticateToken, async (req, res) => {
  if (req.user.type !== "admin") {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  if (!req.body.password) {
    req.body.password = "123456";
  }
  try {
    const programInchargeInfo = {
      ...req.body,
      password: await bcrypt.hash(req.body.password, 10)
    }
    const result = await createProgramIncharge(programInchargeInfo);
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// get program incharge by username
app.get('/api/program-incharge/:username', authenticateToken, async (req, res) => {
  if (!(["admin", "program-incharge"].includes(req.user.type))) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  try {
    const result = await getProgramIncharge({ username: req.params.username });
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// get all program incharges
app.get('/api/program-incharges', authenticateToken, async (req, res) => {
  if (!(["admin", "program-incharge"].includes(req.user.type))) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  try {
    const programIncharges = await getAllProgramIncharges();
    res.status(200).json(programIncharges);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// update program incharge by program incharge id
app.put('/api/program-incharge/:programInchargeId', authenticateToken, async (req, res) => {
  if (req.user.type !== "admin") {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  try {
    const programInchargeInfo = {
      ...req.body,
      // update password if provided
      ...(req.body.password && { password: await bcrypt.hash(req.body.password, 10) })
    }
    const result = await updateProgramIncharge({ _id: req.params.programInchargeId }, programInchargeInfo);
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// delete program incharge by username
app.delete('/api/program-incharge/:username', authenticateToken, async (req, res) => {
  if (req.user.type !== "admin") {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  try {
    const result = await deleteProgramIncharge({ username: req.params.username });
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});



// create admin
app.post('/api/admin', async (req, res) => {
  if (!req.body.password) {
    req.body.password = "123456";
  }
  try {
    const adminInfo = {
      ...req.body,
      password: await bcrypt.hash(req.body.password, 10)
    }
    const result = await createAdmin(adminInfo);
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// get admin by username
app.get('/api/admin/:username', authenticateToken, async (req, res) => {
  if (req.user.type !== "admin") {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  try {
    const result = await getAdmin({ username: req.params.username });
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// get all admins
app.get('/api/admins', authenticateToken, async (req, res) => {
  if (req.user.type !== "admin") {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  try {
    const admins = await getAllAdmins();
    res.status(200).json(admins);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
})

// update admin by admin id
app.put('/api/admin/:adminId', authenticateToken, async (req, res) => {
  if (req.user.type !== "admin" && req.user._id != req.params.adminId) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  try {
    const adminInfo = {
      ...req.body,
      // update password if provided
      ...(req.body.password && { password: await bcrypt.hash(req.body.password, 10) })
    }
    const result = await updateAdmin({ _id: req.params.adminId }, adminInfo);
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }

  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// delete admin by username
app.delete('/api/admin/:username', authenticateToken, async (req, res) => {
  if (req.user.type !== "admin") {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  try {
    const result = await deleteAdmin({ username: req.params.username });
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});




// create course
app.post('/api/course', authenticateToken, async (req, res) => {
  if (req.user.type !== "program-incharge") {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  try {
    const result = await createCourse(req.body);
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// get course by course code
app.get('/api/course/:courseCode', authenticateToken, async (req, res) => {
  try {
    const result = await getCourse({ courseCode: req.params.courseCode });
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// get all courses
app.get('/api/courses', authenticateToken, async (req, res) => {
  try {
    const courses = await getAllCourses();
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// update course by course code
app.put('/api/course/:courseCode', authenticateToken, async (req, res) => {
  if (req.user.type !== "program-incharge") {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  try {
    const result = await updateCourse({ courseCode: req.params.courseCode }, req.body);
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// delete course by course code
app.delete('/api/course/:courseCode', authenticateToken, async (req, res) => {
  if (req.user.type !== "program-incharge") {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  try {
    const result = await deleteCourse({ courseCode: req.params.courseCode });
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});



// create mcq question
app.post('/api/mcq-question', authenticateToken, async (req, res) => {
  if (!(["program-incharge", "professor"].includes(req.user.type))) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  try {
    const result = await createMCQQuestion(req.body);
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// get mcq question by object id
app.get('/api/mcq-question/:oid', authenticateToken, async (req, res) => {
  try {
    const result = await getMCQQuestion({ _id: req.params.oid });
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// update mcq question by object id
app.put('/api/mcq-question/:oid', authenticateToken, async (req, res) => {
  if (!(["program-incharge", "professor"].includes(req.user.type))) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  try {
    const result = await updateMCQQuestion({ _id: req.params.oid }, req.body);
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// delete mcq question by object id
app.delete('/api/mcq-question/:oid', authenticateToken, async (req, res) => {
  if (req.user.type !== "program-incharge") {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  try {
    const result = await deleteMCQQuestion({ _id: req.params.oid });
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});



// create code question
app.post('/api/code-question', authenticateToken, async (req, res) => {
  if (req.user.type !== "professor") {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  try {
    const result = await createCodeQuestion(req.body);
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// get code question by object id
app.get('/api/code-question/:oid', authenticateToken, async (req, res) => {
  try {
    const result = await getCodeQuestion({ _id: req.params.oid });
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// update code question by object id
app.put('/api/code-question/:oid', authenticateToken, async (req, res) => {
  if (req.user.type !== "professor") {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  try {
    const result = await updateCodeQuestion({ _id: req.params.oid }, req.body);
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// delete code question by object id
app.delete('/api/code-question/:oid', authenticateToken, async (req, res) => {
  if (req.user.type !== "professor") {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  try {
    const result = await deleteCodeQuestion({ _id: req.params.oid });
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});



// create exam
app.post('/api/exam', authenticateToken, async (req, res) => {
  if (req.user.type !== "professor") {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  try {
    const result = await createExam(req.body);
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// get exam by object id
app.get('/api/exam/:oid', authenticateToken, async (req, res) => {
  try {
    const result = await getExam({ _id: req.params.oid });
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// get all exams of a course
app.get('/api/exams/:courseCode', authenticateToken, async (req, res) => {
  try {
    const result = await getCourse({ courseCode: req.params.courseCode });
    if (!result.success) {
      return res.status(404).json(result);
    }
    result.data.examIds = await Promise.all(result.data.examIds.map(async (examId) => {
      const exam = await getExam({ _id: examId });
      return exam.success ? exam.data : null;
    }));
    const exams = result.data.examIds;
    res.status(200).json({ success: true, data: exams });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// get all exams of a student by student id / studentUsername or professor by professor id
app.get('/api/exams/', authenticateToken, async (req, res) => {
  let { studentUsername, studentId, professorId } = req.query;
  let courses;
  try {
    let res1;
    if (studentId) {
      res1 = await getStudent({ _id: studentId });
      courses = await Promise.all(res1.data.enrolledCourseIds.map(async (courseId) => {
        const course = await getCourse({ _id: courseId });
        return course.success ? course.data : null;
      }));
    } else if (professorId) {
      res1 = await getProfessor({ _id: professorId });
      courses = await Promise.all(res1.data.courseIds.map(async (courseId) => {
        const course = await getCourse({ _id: courseId });
        return course.success ? course.data : null;
      }));
    } else {
      res1 = await getStudent({ username: studentUsername });
      courses = await Promise.all(res1.data.enrolledCourseIds.map(async (courseId) => {
        const course = await getCourse({ _id: courseId });
        return course.success ? course.data : null;
      }));
    }
    if (!res1.success) {
      return res.status(404).json(res1);
    }
    const examsIds = courses.map((course) => course.examIds).flat();
    const exams = await Promise.all(examsIds.map(async (examId) => {
      const exam = await getExam({ _id: examId });
      return exam.success ? exam.data : null;
    }));
    res.status(200).json({ success: true, data: exams });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// update exam by object id
app.put('/api/exam/:oid', authenticateToken, async (req, res) => {
  if (req.user.type !== "professor") {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  try {
    const result = await updateExam({ _id: req.params.oid }, req.body);
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// delete exam by object id
app.delete('/api/exam/:oid', authenticateToken, async (req, res) => {
  if (req.user.type !== "professor") {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  try {
    const result = await deleteExam({ _id: req.params.oid });
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});



// create result
app.post('/api/result', authenticateToken, async (req, res) => {
  if (req.user.type !== "student") {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  try {
    const result = await createResult(req.body);
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// get result by object id
app.get('/api/result/:oid', authenticateToken, async (req, res) => {
  try {
    const result = await getResult({ _id: req.params.oid });
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// get all results of an exam by exam id
app.get('/api/results/:examId', authenticateToken, async (req, res) => {
  try {
    const result = await getExam({ _id: req.params.examId });
    if (!result.success) {
      return res.status(404).json(result);
    }
    result.data.resultIds = await Promise.all(result.data.resultIds.map(async (resultId) => {
      const result = await getResult({ _id: resultId });
      return result.success ? result.data : null;
    }));
    const results = result.data.resultIds;
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// get result by exam id and student id / username
app.get('/api/result/', authenticateToken, async (req, res) => {
  let { examId, username, studentId } = req.query;
  try {
    if (!studentId) {
      const result = await getStudent({ username: username });
      if (!result.success) {
        return res.status(404).json(result);
      }
      studentId = result.data._id;
    }
    const result = await getResult({ examId, studentId });
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// update result by object id
app.put('/api/result/:oid', authenticateToken, async (req, res) => {
  if (req.user.type !== "student") {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  try {
    const result = await updateResult({ _id: req.params.oid }, req.body);
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// delete result by object id
app.delete('/api/result/:oid', authenticateToken, async (req, res) => {
  if (req.user.type !== "student") {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  try {
    const result = await deleteResult({ _id: req.params.oid });
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});




// create appeal
app.post('/api/appeal', authenticateToken, async (req, res) => {
  try {
    const result = await createAppeal(req.body);
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// get appeal by object id
app.get('/api/appeal/:oid', authenticateToken, async (req, res) => {
  try {
    const result = await getAppeal({ _id: req.params.oid });
    if (result.success) {
      res.status(200).json(result.data);
    } else {
      res.status(404).json(result);
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// get appeal of a result by exam id and student id / username
app.get('/api/appeal/', authenticateToken, async (req, res) => {
  let { examId, username, studentId } = req.query;
  try {
    if (!studentId) {
      const res1 = await getStudent({ username });
      if (!res1.success) {
        return res.status(404).json(res1);
      }
      studentId = res1.data._id;
    }
    const res2 = await getResult({ examId, studentId });
    if (!res2.success) {
      return res.status(404).json(res2);
    }
    const res3 = await getAppeal({ resultId: res2.data._id });
    if (res3.success) {
      res.status(200).json(res3);
    } else {
      res.status(404).json(res3);
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// get all appeals of an exam by exam id
app.get('/api/appeals/:examId', authenticateToken, async (req, res) => {
  try {
    const res = await getExam({ _id: req.params.examId });
    if (!res.success) {
      return res.status(404).json(res);
    }
    res.data.appealIds = await Promise.all(exam.data.appealIds.map(async (appealId) => {
      const appeal = await getAppeal({ _id: appealId });
      return appeal.success ? appeal.data : null;
    }));
    const appeals = res.data.appealIds;
    res.status(200).json({ success: true, appeals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// update appeal by object id
app.put('/api/appeal/:oid', authenticateToken, async (req, res) => {
  try {
    const result = await updateAppeal({ _id: req.params.oid }, req.body);
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// delete appeal by object id
app.delete('/api/appeal/:oid', authenticateToken, async (req, res) => {
  try {
    const result = await deleteAppeal({ _id: req.params.oid });
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});







// Default route
app.get('/', (req, res) => {
  res.send('Welcome to Exam Nexus!')
})

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send({ message: "Something broke!" })
})

app.listen(PORT, () => {
  console.log("Server is listening on port " + PORT)
})
