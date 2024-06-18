import mongoose from 'mongoose';


// Define the Exam schema and model
const examSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  duration: { type: Number, required: true }, // duration in minutes
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true }],
  attendees: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['Upcoming', 'Started', 'Completed'] }
  }]
}, {
  timestamps: true,
});



// Export the models
export default mongoose.models.Exam || mongoose.model('Exam', examSchema);
