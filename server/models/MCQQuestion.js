import { Schema, model } from 'mongoose';

// MCQ Question schema
const MCQQuestionSchema = new Schema({
  questionText: {
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

export default model('MCQQuestion', MCQQuestionSchema, 'mcq_questions');