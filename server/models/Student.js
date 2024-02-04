import { Schema, model } from 'mongoose';

// Student Schema
const StudentSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    unique: true,
    index: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  batch: {
    type: Number,
    required: true,
  },
  semester: {
    type: Number,
    required: true
  },
  enrolledCourseIds: [
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
    courseIds: [{
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
          ref: 'Course',
          required: true
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

export default model('Student', StudentSchema, "students");