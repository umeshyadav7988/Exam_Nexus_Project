import { Schema, model } from 'mongoose';

// Student Schema
const StudentSchema = new Schema({
  studentId: {
    type: String,
    unique: true,
    index: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  personalDetails: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  batch: {
    type: Number,
    required: true,
  },
  semester: {
    type: Number,
    required: true
  },
  enrolledCourses: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Course'
    }
  ],
  pastEnrolledCourses: [{
    semester: {
      type: Number,
      required: true
    },
    courses: [{
      type: Schema.Types.ObjectId,
      ref: 'Course'
    }],
  }],
  performance: {
    semesterPerformance: [{
      semester: {
        type: String,
        required: true
      },
      totalExamsAttended: {
        type: Number,
        required: true,
      },
      totalMaxMarks: {
        type: Number,
        required: true,
      },
      totalMarksScored: {
        type: Number,
        required: true,
      },
      courseRanks: [{
        course: {
          type: Schema.Types.ObjectId,
          ref: 'Course'
        },
        rank: {
          type: Number,
          required: true,
        },
      }],
    }],
    overallPerformance: {
      totalExamsAttended: {
        type: Number,
        required: true,
      },
      totalMaxMarks: {
        type: Number,
        required: true,
      },
      totalMarksScored: {
        type: Number,
        required: true,
      },
    },
  },
});

// Professor Schema
const ProfessorSchema = new Schema({
  professorId: {
    type: String,
    unique: true,
    index: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  personalDetails: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
});

// ProgramIncharge Schema
const ProgramInchargeSchema = new Schema({
  programInchargeId: {
    type: String,
    unique: true,
    index: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  personalDetails: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
});

// Admin Schema
const AdminSchema = new Schema({
  adminId: {
    type: String,
    unique: true,
    index: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  personalDetails: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
});

// Course Schema
const CourseSchema = new Schema({
  courseId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  syllabus: [String],
  professor: {
    type: Schema.Types.ObjectId,
    ref: 'Professor'
  },
  students: [{
    type: Schema.Types.ObjectId,
    ref: 'Student'
  }],
  exams: [{
    type: Schema.Types.ObjectId,
    ref: 'Exam'
  }],
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
});

// MCQ Question schema
const MCQQuestionSchema = new Schema({
  question: {
    type: String,
    required: true
  },
  options: [{
    text: String,
    isCorrect: Boolean
  }],
  marks: {
    type: Number,
    required: true
  },
});

// Code-Based Question schema
const CodeQuestionSchema = new Schema({
  question: {
    type: String,
    required: true
  },
  code: {
    hiddenHeader: String,
    headerFixed: String,
    editableStub: String,
    footerFixed: String,
    hiddenFooter: String,
    driver: String,
  },
  testCases: [{ input: String, expectedOutput: String }],
  programmingLanguages: [String],
  marks: {
    type: Number,
    required: true
  },
});

// Question schema
const QuestionSchema = new Schema({
  type: {
    type: String,
    enum: ['MCQ', 'Code']
  },
  mcqQuestion: {
    type: Schema.Types.ObjectId,
    ref: 'MCQQuestion',
    required: function () {
      return this.type === 'MCQ';
    }
  },
  codeQuestion: {
    type: Schema.Types.ObjectId,
    ref: 'CodeQuestion',
    required: function () {
      return this.type === 'Code';
    }
  },
});

// Exam Schema
const ExamSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  course: {
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
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  maxMarks: {
    type: Number,
    required: true
  },
  questions: [{
    type: Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  }],
  resultAnalytics: {
    totalAttendees: {
      type: Number,
      required: true
    },
    averageMarks: {
      type: Number,
      required: true
    },
    highestMarks: {
      type: Number,
      required: true
    },
  },
  createdAt: {
    type: Date,
    required: true,
    default: () => Date.now()
  },
});

// Result Schema
const ResultSchema = new Schema({
  exam: {
    type: Schema.Types.ObjectId,
    ref: 'Exam'
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student'
  },
  mcqResults: [{
    question: {
      type: Schema.Types.ObjectId,
      ref: 'MCQQuestion'
    },
    selectedOption: Number
  }],
  codeResults: [{
    question: {
      type: Schema.Types.ObjectId,
      ref: 'CodeQuestion'
    },
    code: {
      type: String,
      required: true
    },
  }],
  lastModified: {
    type: Date,
    required: true
  },
  marks: {
    type: Number,
    required: true
  },
  rank: {
    type: Number,
    required: true
  },
});

// Appeal Schema
const AppealSchema = new Schema({
  result: {
    type: Schema.Types.ObjectId,
    ref: 'Result'
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student'
  },
  exam: {
    type: Schema.Types.ObjectId,
    ref: 'Exam'
  },
  appealText: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: () => Date.now()
  },
});

// Export models
export const Student = model('Student', StudentSchema);
export const Professor = model('Professor', ProfessorSchema);
export const ProgramIncharge = model('ProgramIncharge', ProgramInchargeSchema);
export const Admin = model('Admin', AdminSchema);
export const Course = model('Course', CourseSchema);
export const MCQQuestion = model('MCQQuestion', MCQQuestionSchema);
export const CodeQuestion = model('CodeQuestion', CodeQuestionSchema);
export const Question = model('Question', QuestionSchema);
export const Exam = model('Exam', ExamSchema);
export const Result = model('Result', ResultSchema);
export const Appeal = model('Appeal', AppealSchema);