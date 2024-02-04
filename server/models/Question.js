import { Schema, model } from 'mongoose';

// Question schema
const QuestionSchema = new Schema({
  type: {
    type: String,
    enum: ['MCQ', 'Code']
  },
  mcqQuestionId: {
    type: Schema.Types.ObjectId,
    ref: 'MCQQuestion',
    required: function () {
      return this.type === 'MCQ';
    }
  },
  codeQuestionId: {
    type: Schema.Types.ObjectId,
    ref: 'CodeQuestion',
    required: function () {
      return this.type === 'Code';
    }
  },
});

export default model("Question", QuestionSchema, "questions");