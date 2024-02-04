import { Schema, model } from 'mongoose';

// Code-Based Question schema
const CodeQuestionSchema = new Schema({
  questionText: {
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

export default model('CodeQuestion', CodeQuestionSchema, 'code_questions');