import { Schema, model } from 'mongoose';

// Result Schema
const ResultSchema = new Schema({
  examId: {
    type: Schema.Types.ObjectId,
    ref: 'Exam'
  },
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'Student'
  },
  mcqResults: [{
    mcqQuestionId: {
      type: Schema.Types.ObjectId,
      ref: 'MCQQuestion'
    },
    selectedOption: Number
  }],
  codeResults: [{
    codeQuestionId: {
      type: Schema.Types.ObjectId,
      ref: 'CodeQuestion'
    },
    submittedCode: {
      type: String,
      required: true
    },
  }],
  createdAt: {
    type: Date,
    required: true,
    default: () => Date.now()
  },
  updatedAt: {
    type: Date,
    required: true,
    default: () => Date.now()
  },
  marks: {
    type: Number,
    required: true
  },
  rank: {
    type: Number,
    required: true
  },
  appealId: {
    type: Schema.Types.ObjectId,
    ref: 'Appeal'
  }
});

export default model('Result', ResultSchema, 'results');