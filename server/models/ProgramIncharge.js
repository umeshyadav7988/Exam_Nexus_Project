import { Schema, model } from 'mongoose';

// ProgramIncharge Schema
const ProgramInchargeSchema = new Schema({
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
  }
});

export default model("ProgramIncharge", ProgramInchargeSchema, "program_incharges")