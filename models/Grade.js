import mongoose from 'mongoose';

const gradeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  grade: {
    type: Number,
    required: true
  },
  response: {
    type: Map,
    of: String,
    required: true
  }
}, {
  timestamps: true
});

gradeSchema.index({ student: 1, exam: 1 }, { unique: true });

const Grade = mongoose.models.Grade || mongoose.model('Grade', gradeSchema);

export default Grade;
