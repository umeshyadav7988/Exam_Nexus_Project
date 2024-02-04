import { Schema, model } from 'mongoose';

// Exam Schema
const ExamSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course'
  },
  syllabus: [{
    type: String,
    required: true,
  }],
  dateTime: {
    type: Date,
    required: true
  },
  loginWindowCloseTime: {
    type: Date,
    required: true,
    default: () => (Date.now() + 30 * 60 * 1000)
  },
  duration: {
    type: Number,
    required: true
  },
  maxMarks: {
    type: Number,
    required: true
  },
  mcqQuestionIds: [{
    type: Schema.Types.ObjectId,
    ref: 'MCQQuestion',
  }],
  codeQuestionIds: [{
    type: Schema.Types.ObjectId,
    ref: 'CodeQuestion',
  }],
  resultIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Result'
  }],
  resultAnalytics: {
    totalAttendees: {
      type: Number,
      required: true
    },
    totalMarksScored:{
      type: Number,
      required: true
    },
    highestMarksInfo: {
      marks: {
        type: Number,
        required: true
      },
      studentId: {
        type: Schema.Types.ObjectId,
        ref: 'Student'
      }
    },
  },
  createdAt: {
    type: Date,
    required: true,
    default: () => Date.now()
  },
  appealIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Appeal'
  }],
});

export default model("Exam", ExamSchema, "exams");