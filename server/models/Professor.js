import { Schema, model } from 'mongoose';

// Professor Schema
const ProfessorSchema = new Schema({
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
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  courseIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Course'
  }],
});

export default model('Professor', ProfessorSchema, 'professors');