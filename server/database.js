// Desc: Database connection and CRUD operations

// IMPORTS

import dotenv from 'dotenv';
import mongoose from 'mongoose';

// importing models
import Student from './models/Student.js';
import Professor from './models/Professor.js';
import ProgramIncharge from './models/ProgramIncharge.js';
import Admin from './models/Admin.js';
import Exam from './models/Exam.js';
import Result from './models/Result.js';
import Appeal from './models/Appeal.js';
import Course from './models/Course.js';
import MCQQuestion from './models/MCQQuestion.js';
import CodeQuestion from './models/CodeQuestion.js';

dotenv.config();

// CONNECTING TO DATABASE
mongoose.connect(process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017/exam_nexus_db');
const connection = mongoose.connection;
connection.once('open', function () {
  console.log("database connected");
});
connection.on('error', () => console.log("Couldn't connect to MongoDB"));

// CREATE FUNCTIONS

// create student
export const createStudent = async (studentInfo) => {
  try {
    const newStudent = await Student.create(studentInfo);
    return {
      success: true,
      data: newStudent
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
}

// create professor
export const createProfessor = async (professorInfo) => {
  try {
    const newProfessor = await Professor.create(professorInfo);
    return {
      success: true,
      data: newProfessor
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
}

// create program incharge
export const createProgramIncharge = async (programInchargeInfo) => {
  try {
    const newProgramIncharge = await ProgramIncharge.create(programInchargeInfo);
    return {
      success: true,
      data: newProgramIncharge
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
}

// create admin
export const createAdmin = async (adminInfo) => {
  try {
    const newAdmin = await Admin.create(adminInfo);
    return {
      success: true,
      data: newAdmin
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
}

// create course
export const createCourse = async (courseInfo) => {
  try {
    const professor = await Professor.findById(courseInfo.professorId);
    if (!professor) {
      return {
        success: false,
        message: "Professor not found"
      };
    }
    const students = await Student.find({ _id: { $in: courseInfo.studentIds } });
    if (students.length !== courseInfo.studentIds.length) {
      return {
        success: false,
        message: "One or more students not found"
      };
    }
    const newCourse = await Course.create(courseInfo);
    professor.courseIds.push(newCourse._id);
    await professor.save();
    for (const student of students) {
      student.enrolledCourseIds.push(newCourse._id);
      await student.save();
    };
    return {
      success: true,
      data: newCourse
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
}

// create mcq question
export const createMCQQuestion = async (mcqQuestionInfo) => {
  try {
    const newMCQQuestion = await MCQQuestion.create(mcqQuestionInfo);
    return {
      success: true,
      data: newMCQQuestion
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
}

// create code question
export const createCodeQuestion = async (codeQuestionInfo) => {
  try {
    const newCodeQuestion = await CodeQuestion.create(codeQuestionInfo);
    return {
      success: true,
      data: newCodeQuestion
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
}

// create exam
export const createExam = async (examInfo) => {
  try {
    const course = await Course.findById(examInfo.courseId);
    if (!course) {
      return {
        success: false,
        message: "Course not found"
      };
    }
    const newExam = await Exam.create(examInfo);
    course.examIds.push(newExam._id);
    await course.save();
    return {
      success: true,
      data: newExam
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
}

// calculate all ranks of an exam's results
const calculateRanks = async (exam) => {
  await exam.populate('resultIds');
  const results = exam.resultIds;
  results.sort((result1, result2) => result2.marks - result1.marks);
  for (const [index, result] of results.entries()) {
    result.rank = index + 1;
    await result.save();
  };
}

// calculate result marks
const calculateResultMarks = async (exam, result) => {
  await exam.populate('mcqQuestionIds')
  let marks = 0;
  for (let index = 0; index < result.mcqResults.length; index++) {
    const mcqResult = result.mcqResults[index];
    const mcqQuestion = exam.mcqQuestionIds[index];
    if (!isNaN(mcqResult.selectedOption) && mcqQuestion.options[mcqResult.selectedOption].isCorrect)
      marks += mcqQuestion.marks;
  }
  return marks;
}

// create result
export const createResult = async (resultInfo) => {
  try {
    const exam = await Exam.findById(resultInfo.examId);
    if (!exam) {
      return {
        success: false,
        message: "Exam not found"
      };
    }
    const student = await Student.findById(resultInfo.studentId);
    if (!student) {
      return {
        success: false,
        message: "Student not found"
      };
    }
    let marks = 0;
    marks += await calculateResultMarks(exam, resultInfo);
    resultInfo.marks = marks;
    resultInfo.updatedAt = new Date();
    resultInfo.rank = 0;
    const newResult = await Result.findOneAndUpdate({ examId: resultInfo.examId, studentId: resultInfo.studentId }, resultInfo, { upsert: true, new: true });
    if (!exam.resultIds.includes(newResult._id)) {
      exam.resultIds.push(newResult._id);
      exam.resultAnalytics.totalAttendees = exam.resultIds.length;
      exam.resultAnalytics.totalMarksScored += newResult.marks;
    }
    if (newResult.marks > exam.resultAnalytics.highestMarksInfo.marks) {
      exam.resultAnalytics.highestMarksInfo.marks = newResult.marks;
      exam.resultAnalytics.highestMarksInfo.studentId = newResult.studentId;
    }
    await exam.save();
    await calculateRanks(exam);
    return {
      success: true,
      data: await Result.findById(newResult._id)
    };
  } catch (error) {
    await Result.deleteOne({ examId: resultInfo.examId, studentId: resultInfo.studentId });
    return {
      success: false,
      message: error.message
    };
  }
}

// create appeal
export const createAppeal = async (appealInfo) => {
  try {
    const result = await Result.findById(appealInfo.resultId);
    if (!result) {
      return {
        success: false,
        message: "Result not found"
      };
    }
    const exam = await Exam.findById(result.examId);
    if (!exam) {
      return {
        success: false,
        message: "Exam not found"
      };
    }
    const newAppeal = await Appeal.create(appealInfo);
    result.appealId = newAppeal._id;
    await result.save();
    exam.appealIds.push(newAppeal._id);
    await exam.save();
    return {
      success: true,
      data: newAppeal
    };
  } catch (error) {
    await Appeal.deleteOne({ resultId: appealInfo.resultId });
    return {
      success: false,
      message: error.message
    };
  }
}



// READ FUNCTIONS / GET FUNCTIONS

// get student / read student
export const getStudent = async (studentInfo) => {
  const student = await Student.findOne(studentInfo);
  if (student) {
    return {
      success: true,
      data: student
    };
  } else {
    return {
      success: false,
      message: "Student not found"
    };
  }
}

// get all students / read all students
export const getAllStudents = async () => {
  const students = await Student.find({});
  if (students && students.length > 0) {
    return {
      success: true,
      data: students
    };
  } else {
    return {
      success: false,
      message: "Students not found"
    };
  }
}

// get multiple students / read multiple students
export const getStudents = async (studentsInfo) => {
  const students = await Student.find(studentsInfo);
  if (students && students.length > 0) {
    return {
      success: true,
      data: students
    };
  } else {
    return {
      success: false,
      message: "Students not found"
    };
  }
}

// get professor / read professor
export const getProfessor = async (professorInfo) => {
  const professor = await Professor.findOne(professorInfo);
  if (professor) {
    return {
      success: true,
      data: professor
    };
  } else {
    return {
      success: false,
      message: "Professor not found"
    };
  }
}

// get all professors / read all professors
export const getAllProfessors = async () => {
  const professors = await Professor.find({});
  if (professors && professors.length > 0) {
    return {
      success: true,
      data: professors
    };
  } else {
    return {
      success: false,
      message: "Professors not found"
    };
  }
}

// get program incharge / read program incharge
export const getProgramIncharge = async (programInchargeInfo) => {
  const programIncharge = await ProgramIncharge.findOne(programInchargeInfo);
  if (programIncharge) {
    return {
      success: true,
      data: programIncharge
    };
  } else {
    return {
      success: false,
      message: "Program Incharge not found"
    };
  }
}

// get all program incharges / read all program incharges
export const getAllProgramIncharges = async () => {
  const programIncharges = await ProgramIncharge.find({});
  if (programIncharges && programIncharges.length > 0) {
    return {
      success: true,
      data: programIncharges
    };
  } else {
    return {
      success: false,
      message: "Program Incharges not found"
    };
  }
}

// get admin / read admin
export const getAdmin = async (adminInfo) => {
  const admin = await Admin.findOne(adminInfo);
  if (admin) {
    return {
      success: true,
      data: admin
    };
  } else {
    return {
      success: false,
      message: "Admin not found"
    };
  }
}

// get all admins / read all admins
export const getAllAdmins = async () => {
  const admins = await Admin.find({});
  if (admins && admins.length > 0) {
    return {
      success: true,
      data: admins
    };
  } else {
    return {
      success: false,
      message: "Admins not found"
    };
  }
}

// get course / read course
export const getCourse = async (courseInfo) => {
  const course = await Course.findOne(courseInfo);
  if (course) {
    await course.populate('professorId');
    await course.populate('studentIds');
    await course.populate('examIds');
    return {
      success: true,
      data: course
    };
  } else {
    return {
      success: false,
      message: "Course not found"
    };
  }
}

// get all courses / read all courses
export const getAllCourses = async () => {
  const courses = await Course.find({});
  if (courses && courses.length > 0) {
    return {
      success: true,
      data: courses
    };
  } else {
    return {
      success: false,
      message: "Courses not found"
    };
  }
}

// get mcq question / read mcq question
export const getMCQQuestion = async (mcqQuestionInfo) => {
  const mcqQuestion = await MCQQuestion.findOne(mcqQuestionInfo);
  if (mcqQuestion) {
    return {
      success: true,
      data: mcqQuestion
    };
  } else {
    return {
      success: false,
      message: "MCQ Question not found"
    };
  }
}

// get code question / read code question
export const getCodeQuestion = async (codeQuestionInfo) => {
  const codeQuestion = await CodeQuestion.findOne(codeQuestionInfo);
  if (codeQuestion) {
    return {
      success: true,
      data: codeQuestion
    };
  } else {
    return {
      success: false,
      message: "Code Question not found"
    };
  }
}

// get exam / read exam
export const getExam = async (examInfo) => {
  const exam = await Exam.findOne(examInfo);
  if (exam) {
    await exam.populate('courseId');
    await exam.populate('mcqQuestionIds');
    await exam.populate('codeQuestionIds')
    await exam.populate('resultIds');
    return {
      success: true,
      data: exam
    };
  } else {
    return {
      success: false,
      message: "Exam not found"
    };
  }
}

// get all exams by student id / read all exams by student id
export const getAllExamsByStudentId = async (studentId) => {
  const courses = await Course.find({ studentIds: { $elemMatch: { $eq: studentId } } });
  const exams = await Exam.find({ courseId: { $in: courses.map(course => course._id) } });
  if (exams && exams.length > 0) {
    return {
      success: true,
      data: exams
    };
  } else {
    return {
      success: false,
      message: "Exams not found"
    };
  }
}

// get result / read result
export const getResult = async (resultInfo) => {
  const result = await Result.findOne(resultInfo);
  if (result) {
    return {
      success: true,
      data: result
    };
  } else {
    return {
      success: false,
      message: "Result not found"
    };
  }
}

// get appeal / read appeal
export const getAppeal = async (appealInfo) => {
  const appeal = await Appeal.findOne(appealInfo);
  if (appeal) {
    return {
      success: true,
      data: appeal
    };
  } else {
    return {
      success: false,
      message: "Appeal not found"
    };
  }
}



// UPDATE FUNCTIONS

// update student
export const updateStudent = async (studentInfo, update) => {
  const student = await Student.findOne(studentInfo);
  if (student) {
    try {
      const updateResponse = await student.updateOne(update);
      if (updateResponse.acknowledged) {
        return {
          success: true,
          data: await Student.findById(student._id)
        };
      }
      throw new Error("Couldn't update student for unknown reason");
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  } else {
    return {
      success: false,
      message: "Student not found"
    };
  }
}

// update professor
export const updateProfessor = async (professorInfo, update) => {
  const professor = await Professor.findOne(professorInfo);
  if (professor) {
    try {
      const updateResponse = await professor.updateOne(update);
      if (updateResponse.acknowledged) {
        return {
          success: true,
          data: await Professor.findById(professor._id)
        };
      }
      throw new Error("Couldn't update professor for unknown reason");
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  } else {
    return {
      success: false,
      message: "Professor not found"
    };
  }
}

// update program incharge
export const updateProgramIncharge = async (programInchargeInfo, update) => {
  const programIncharge = await ProgramIncharge.findOne(programInchargeInfo);
  if (programIncharge) {
    try {
      const updateResponse = await programIncharge.updateOne(update);
      if (updateResponse.acknowledged) {
        return {
          success: true,
          data: await ProgramIncharge.findById(programIncharge._id)
        };
      }
      throw new Error("Couldn't update program incharge for unknown reason");
    } catch (error) {
    }
  } else {
  }
}

// update admin
export const updateAdmin = async (adminInfo, update) => {
  const admin = await Admin.findOne(adminInfo);
  if (admin) {
    try {
      const updateResponse = await admin.updateOne(update);
      if (updateResponse.acknowledged) {
        return {
          success: true,
          data: await Admin.findById(admin._id)
        };
      }
      throw new Error("Couldn't update admin for unknown reason");
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  } else {
    return {
      success: false,
      message: "Admin not found"
    };
  }
}

// update course
export const updateCourse = async (courseInfo, update) => {
  const course = await Course.findOne(courseInfo);
  if (course) {
    try {
      const updateResponse = await course.updateOne(update);
      if (updateResponse.acknowledged) {
        return {
          success: true,
          data: await Course.findById(course._id)
        };
      }
      throw new Error("Couldn't update course for unknown reason");
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  } else {
    return {
      success: false,
      message: "Course not found"
    };
  }
}

// update mcq question
export const updateMCQQuestion = async (mcqQuestionInfo, update) => {
  const mcqQuestion = await MCQQuestion.findOne(mcqQuestionInfo);
  if (mcqQuestion) {
    try {
      const updateResponse = await mcqQuestion.updateOne(update);
      if (updateResponse.acknowledged) {
        const exam = await Exam.findOne({ mcqQuestionIds: mcqQuestion._id });
        recalculateExamResults(exam._id);
        return {
          success: true,
          data: await MCQQuestion.findById(mcqQuestion._id)
        };
      }
      throw new Error("Couldn't update MCQ question for unknown reason");
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  } else {
    return {
      success: false,
      message: "MCQ Question not found"
    };
  }
}

// update code question
export const updateCodeQuestion = async (codeQuestionInfo, update) => {
  const codeQuestion = await CodeQuestion.findOne(codeQuestionInfo);
  if (codeQuestion) {
    try {
      const updateResponse = await codeQuestion.updateOne(update);
      if (updateResponse.acknowledged) {
        const exam = await Exam.findOne({ mcqQuestionIds: mcqQuestion._id });
        recalculateExamResults(exam._id);
        return {
          success: true,
          data: await CodeQuestion.findById(codeQuestion._id)
        };
      }
      throw new Error("Couldn't update code question for unknown reason");
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }
  return {
    success: false,
    message: "Code Question not found"
  };
}

// update exam
export const updateExam = async (examInfo, update) => {
  const exam = await Exam.findOne(examInfo);
  if (exam) {
    try {
      const updateResponse = await exam.updateOne(update);
      if (updateResponse.acknowledged) {
        return {
          success: true,
          data: await Exam.findById(exam._id)
        };
      }
      throw new Error("Couldn't update exam for unknown reason");
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  } else {
    return {
      success: false,
      message: "Exam not found"
    };
  }
}

// recalculate all results of an exam
export const recalculateExamResults = async (examId) => {
  try {
    const exam = await Exam.findById(examId);
    if (!exam) {
      return {
        success: false,
        message: "Exam not found"
      };
    }
    const examCopy = exam;
    await examCopy.populate('resultIds');
    const results = examCopy.resultIds;
    exam.resultAnalytics.totalMarksScored = 0;
    exam.resultAnalytics.highestMarksInfo.marks = 0;
    exam.resultAnalytics.highestMarksInfo.studentId = null;
    for (const result of results) {
      let marks = 0;
      marks += await calculateResultMarks(exam, result);
      result.marks = marks;
      result.updatedAt = new Date();
      await result.save();
      exam.resultAnalytics.totalMarksScored += marks;
      if (marks > exam.resultAnalytics.highestMarksInfo.marks) {
        exam.resultAnalytics.highestMarksInfo.marks = marks;
        exam.resultAnalytics.highestMarksInfo.studentId = result.studentId;
      }
    };
    await exam.save();
    await calculateRanks(exam);
    console.log("Recalculated results of exam: " + examId);
    return {
      success: true,
      data: await Exam.findById(exam._id)
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
}

// update result
export const updateResult = async (resultInfo, update) => {
  const result = await Result.findOne(resultInfo);
  if (result) {
    try {
      const updateResponse = await result.updateOne(update);
      if (updateResponse.acknowledged) {
        const exam = await Exam.findOne({ resultIds: result._id });
        recalculateExamResults(exam._id);
        return {
          success: true,
          data: await Result.findById(result._id)
        };
      }
      throw new Error("Couldn't update result for unknown reason");
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }
  return {
    success: false,
    message: "Result not found"
  };
}

// update appeal
export const updateAppeal = async (appealInfo, update) => {
  const appeal = await Appeal.findOne(appealInfo);
  if (appeal) {
    try {
      const updateResponse = await appeal.updateOne(update);
      if (updateResponse.acknowledged) {
        return {
          success: true,
          data: await Appeal.findById(appeal._id)
        };
      }
      throw new Error("Couldn't update appeal for unknown reason");
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }
  return {
    success: false,
    message: "Appeal not found"
  };
}



// DELETE FUNCTIONS

// delete student
export const deleteStudent = async (studentInfo) => {
  try {
    await Student.deleteOne(studentInfo);
    return {
      success: true,
      data: "Student deleted"
    };
  } catch (error) {
    return {
      success: false,
      message: err.message
    };
  }
}

// delete professor
export const deleteProfessor = async (professorInfo) => {
  try {
    await Professor.deleteOne(professorInfo);
    return {
      success: true,
      data: "Professor deleted"
    };
  } catch (error) {
    return {
      success: false,
      message: err.message
    };
  }
}

// delete program incharge
export const deleteProgramIncharge = async (programInchargeInfo) => {
  try {
    await ProgramIncharge.deleteOne(programInchargeInfo);
    return {
      success: true,
      data: "Program Incharge deleted"
    };
  } catch (error) {
    return {
      success: false,
      message: err.message
    };
  }
}

// delete admin
export const deleteAdmin = async (adminInfo) => {
  try {
    await Admin.deleteOne(adminInfo);
    return {
      success: true,
      data: "Admin deleted"
    };
  } catch (error) {
    return {
      success: false,
      message: err.message
    };
  }
}

// delete course
export const deleteCourse = async (courseInfo) => {
  try {
    await Course.deleteOne(courseInfo);
    return {
      success: true,
      data: "Course deleted"
    };
  } catch (error) {
    return {
      success: false,
      message: err.message
    };
  }
}

// delete mcq question
export const deleteMCQQuestion = async (mcqQuestionInfo) => {
  try {
    await MCQQuestion.deleteOne(mcqQuestionInfo);
    return {
      success: true,
      data: "MCQ Question deleted"
    };
  } catch (error) {
    return {
      success: false,
      message: err.message
    };
  }
}

// delete code question
export const deleteCodeQuestion = async (codeQuestionInfo) => {
  try {
    await CodeQuestion.deleteOne(codeQuestionInfo);
    return {
      success: true,
      data: "Code Question deleted"
    };
  } catch (error) {
    return {
      success: false,
      message: err.message
    };
  }
}

// delete exam
export const deleteExam = async (examInfo) => {
  try {
    await Exam.deleteOne(examInfo);
    return {
      success: true,
      data: "Exam deleted"
    };
  } catch (error) {
    return {
      success: false,
      message: err.message
    };
  }
}

// delete result
export const deleteResult = async (resultInfo) => {
  try {
    await Result.deleteOne(resultInfo);
    return {
      success: true,
      data: "Result deleted"
    };
  } catch (error) {
    return {
      success: false,
      message: err.message
    };
  }
}

// delete appeal
export const deleteAppeal = async (appealInfo) => {
  try {
    await Appeal.deleteOne(appealInfo);
    return {
      success: true,
      data: "Appeal deleted"
    };
  } catch (error) {
    return {
      success: false,
      message: err.message
    };
  }
}





// console.log(await createStudent({
//   name: "Anshika",
//   email: "anshika@gmail.com",
//   username: "2111981045",
//   password: "123456",
//   batch: 2021,
//   semester: 1,
//   enrolledCourseIds: [],
//   pastEnrolledCourses: [],
//   performance: {
//     semesterPerformance: [],
//     overallPerformance: {
//       totalExamsAttended: 0,
//       totalMaxMarks: 0,
//       totalMarksScored: 0,
//     }
//   }
// }));
// console.log(await deleteStudent({username: "2111981045"}));


// TESTING RESULT ADDITION

// // creating 4 students
// const student1 = await createStudent({
//   name: "Pranav",
//   email: "pranav@gmail.com",
//   username: "2111981140",
//   password: "123456",
//   batch: 2021,
//   semester: 1,
//   enrolledCourseIds: [],
//   pastEnrolledCourses: [],
//   performance: {
//     semesterPerformance: [],
//     overallPerformance: {
//       totalExamsAttended: 0,
//       totalMaxMarks: 0,
//       totalMarksScored: 0,
//     }
//   }
// })
// console.log(student1);
// const student2 = await createStudent({
//   name: "Madhav",
//   email: "madhav@gmail.com",
//   username: "2011981262",
//   password: "123456",
//   batch: 2021,
//   semester: 1,
//   enrolledCourseIds: [],
//   pastEnrolledCourses: [],
//   performance: {
//     semesterPerformance: [],
//     overallPerformance: {
//       totalExamsAttended: 0,
//       totalMaxMarks: 0,
//       totalMarksScored: 0,
//     }
//   }
// })
// console.log(student2);
// const student3 = await createStudent({
//   name: "Aayush",
//   email: "aayush@gmail.com",
//   username: "2111981048",
//   password: "123456",
//   batch: 2021,
//   semester: 1,
//   enrolledCourseIds: [],
//   pastEnrolledCourses: [],
//   performance: {
//     semesterPerformance: [],
//     overallPerformance: {
//       totalExamsAttended: 0,
//       totalMaxMarks: 0,
//       totalMarksScored: 0,
//     }
//   }
// })
// console.log(student3);
// const student4 = await createStudent({
//   name: "Jasmine",
//   email: "jasmine@gmail.com",
//   username: "2111981160",
//   password: "123456",
//   batch: 2021,
//   semester: 1,
//   enrolledCourseIds: [],
//   pastEnrolledCourses: [],
//   performance: {
//     semesterPerformance: [],
//     overallPerformance: {
//       totalExamsAttended: 0,
//       totalMaxMarks: 0,
//       totalMarksScored: 0,
//     }
//   }
// })
// console.log(student4);

// // creating a professor
// const professor1 = await createProfessor({
//   username: "1",
//   password: "123456",
//   name: "Manan",
//   email: "manan@gmail.com",
//   courseIds: []
// })
// console.log(professor1);

// // creating a course
// const course1 = await createCourse({
//   name: "DSA",
//   courseCode: "DSA265",
//   syllabus: ["DSA"],
//   professorId: (await Professor.findOne({}).select('_id'))._id,
//   studentIds: (await Student.find({}).select('_id')).map(studentObj => studentObj._id),
//   examIds: [],
//   startDate: new Date(),
// })
// console.log(course1);

// // creating 4 mcq questions
// const mcqQuestion1 = await createMCQQuestion({
//   questionText: "What is the time complexity of bubble sort?",
//   options: [{
//     text: "O(n)",
//     isCorrect: false
//   }, {
//     text: "O(nlogn)",
//     isCorrect: false
//   }, {
//     text: "O(n^2)",
//     isCorrect: true
//   }, {
//     text: "O(n^3)",
//     isCorrect: false
//   }],
//   marks: 1
// })
// console.log(mcqQuestion1);
// const mcqQuestion2 = await createMCQQuestion({
//   questionText: "What is the time complexity of merge sort?",
//   options: [{
//     text: "O(n)",
//     isCorrect: false
//   }, {
//     text: "O(nlogn)",
//     isCorrect: true
//   }, {
//     text: "O(n^2)",
//     isCorrect: false
//   }, {
//     text: "O(n^3)",
//     isCorrect: false
//   }],
//   marks: 1
// })
// console.log(mcqQuestion2);
// const mcqQuestion3 = await createMCQQuestion({
//   questionText: "What form of polymorphism is method overloading?",
//   options: [{
//     text: "Compile time polymorphism",
//     isCorrect: true
//   }, {
//     text: "Run time polymorphism",
//     isCorrect: false
//   }, {
//     text: "Both",
//     isCorrect: false
//   }, {
//     text: "None",
//     isCorrect: false
//   }],
//   marks: 1
// })
// console.log(mcqQuestion3);
// const mcqQuestion4 = await createMCQQuestion({
//   questionText: "What form of polymorphism is method overriding?",
//   options: [{
//     text: "Compile time polymorphism",
//     isCorrect: false
//   }, {
//     text: "Run time polymorphism",
//     isCorrect: true
//   }, {
//     text: "Both",
//     isCorrect: false
//   }, {
//     text: "None",
//     isCorrect: false
//   }],
//   marks: 1
// })
// console.log(mcqQuestion4);

// creating an exam
// const exam1 = await createExam({
//   name: "DSA Midsem",
//   courseId: (await Course.findOne({}).select('_id'))._id,
//   syllabus: ["DSA"],
//   dateTime: new Date(2024, 1, 25, 13, 30),
//   loginWindowCloseTime: new Date(2024, 1, 25, 13, 30) + (30 * 60 * 1000),
//   duration: 60,
//   maxMarks: 10,
//   mcqQuestionIds: (await MCQQuestion.find({}).select('_id')).map(mcqQuestionObj => mcqQuestionObj._id),
//   codeQuestionIds: [],
//   resultIds: [],
//   resultAnalytics: {
//     totalAttendees: 0,
//     totalMarksScored: 0,
//     highestMarksInfo: {
//       marks: 0,
//       studentId: null
//     }
//   }
// })
// console.log(exam1);

// creating 4 results
// const result1 = await createResult({
//   examId: (await Exam.findOne({}).select('_id'))._id,
//   studentId: (await Student.find({}).select('_id').skip(0).limit(1))[0]._id,
//   mcqResults: [{
//     mcqQuestionId: (await MCQQuestion.find({}).select('_id').skip(0).limit(1))[0]._id,
//     selectedOption: 1
//   }, {
//     mcqQuestionId: (await MCQQuestion.find({}).select('_id').skip(1).limit(1))[0]._id,
//     selectedOption: 2
//   }, {
//     mcqQuestionId: (await MCQQuestion.find({}).select('_id').skip(2).limit(1))[0]._id,
//     selectedOption: 3
//   }, {
//     mcqQuestionId: (await MCQQuestion.find({}).select('_id').skip(3).limit(1))[0]._id,
//     selectedOption: 1
//   }],
// })
// console.log(result1);
// const result2 = await createResult({
//   examId: (await Exam.findOne({}).select('_id'))._id,
//   studentId: (await Student.find({}).select('_id').skip(1).limit(1))[0]._id,
//   mcqResults: [{
//     mcqQuestionId: (await MCQQuestion.find({}).select('_id').skip(0).limit(1))[0]._id,
//     selectedOption: 2
//   }, {
//     mcqQuestionId: (await MCQQuestion.find({}).select('_id').skip(1).limit(1))[0]._id,
//     selectedOption: 1
//   }, {
//     mcqQuestionId: (await MCQQuestion.find({}).select('_id').skip(2).limit(1))[0]._id,
//     selectedOption: 3
//   }, {
//     mcqQuestionId: (await MCQQuestion.find({}).select('_id').skip(3).limit(1))[0]._id,
//     selectedOption: 1
//   }],
// })
// console.log(result2);
// const result3 = await createResult({
//   examId: (await Exam.findOne({}).select('_id'))._id,
//   studentId: (await Student.find({}).select('_id').skip(2).limit(1))[0]._id,
//   mcqResults: [{
//     mcqQuestionId: (await MCQQuestion.find({}).select('_id').skip(0).limit(1))[0]._id,
//     selectedOption: 2
//   }, {
//     mcqQuestionId: (await MCQQuestion.find({}).select('_id').skip(1).limit(1))[0]._id,
//     selectedOption: 1
//   }, {
//     mcqQuestionId: (await MCQQuestion.find({}).select('_id').skip(2).limit(1))[0]._id,
//     selectedOption: 0
//   }, {
//     mcqQuestionId: (await MCQQuestion.find({}).select('_id').skip(3).limit(1))[0]._id,
//     selectedOption: 1
//   }],
// })
// console.log(result3);
// const result4 = await createResult({
//   examId: (await Exam.findOne({}).select('_id'))._id,
//   studentId: (await Student.find({}).select('_id').skip(3).limit(1))[0]._id,
//   mcqResults: [{
//     mcqQuestionId: (await MCQQuestion.find({}).select('_id').skip(0).limit(1))[0]._id,
//     selectedOption: 2
//   }, {
//     mcqQuestionId: (await MCQQuestion.find({}).select('_id').skip(1).limit(1))[0]._id,
//     selectedOption: 1
//   }, {
//     mcqQuestionId: (await MCQQuestion.find({}).select('_id').skip(2).limit(1))[0]._id,
//     selectedOption: 1
//   }, {
//     mcqQuestionId: (await MCQQuestion.find({}).select('_id').skip(3).limit(1))[0]._id,
//     selectedOption: 2
//   }],
// })
// console.log(result4);

// print all results with ranks and student details
// console.log("RANKS");
// const results = await Exam.findOne().populate('resultIds').select('resultIds');
// results.resultIds.forEach(result => {
//   console.log(result.rank, result.studentId);
// })

// updating an mcq question
// const mcqQuestionUpdateResult = await updateMCQQuestion({
//   questionText: "What is the time complexity of bubble sort?",
// }, {
//   options: [{
//     text: "O(n)",
//     isCorrect: false
//   }, {
//     text: "O(nlogn)",
//     isCorrect: false
//   }, {
//     text: "O(n^2)",
//     isCorrect: true
//   }, {
//     text: "O(n^3)",
//     isCorrect: false
//   }],
//   marks: 1
// })