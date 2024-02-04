import { Schema, model } from 'mongoose';

// Admin Schema
const AdminSchema = new Schema({
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

export default model("Admin", AdminSchema, "admins");