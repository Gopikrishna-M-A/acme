// models/User.js

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  image: String,
  isTeacher: { type: Boolean, default: false },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
