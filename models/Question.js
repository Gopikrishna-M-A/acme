import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  mark: {
    type: Number,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  optionA: {
    type: String,
    required: true,
  },
  optionB: {
    type: String,
    required: true,
  },
  optionC: {
    type: String,
    required: true,
  },
  optionD: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

questionSchema.set("timestamps", true);

export default mongoose.models.Question || mongoose.model("Question", questionSchema);
