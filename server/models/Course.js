import { Schema, model } from 'mongoose';

// Course Schema
const CourseSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  courseCode: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  syllabus: {
    type: [String],
    required: true
  },
  professorId: {
    type: Schema.Types.ObjectId,
    ref: 'Professor',
    required: true
  },
  studentIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Student'
  }],
  examIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Exam'
  }],
  startDate: {
    type: Date,
    required: true,
    default: () => Date.now()
  },
  endDate: {
    type: Date,
    required: true,
    // default 6 months after startDate
    default: () => (Date.now() + 182 * 24 * 60 * 60 * 1000)
  },
});

export default model('Course', CourseSchema, 'courses');