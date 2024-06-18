import mongoose from "mongoose"

const { Schema } = mongoose

const examResponseSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  exam: { type: Schema.Types.ObjectId, ref: "Exam", required: true },
  responses: [
    {
      question: {
        type: Schema.Types.ObjectId,
        ref: "Question",
        required: true,
      },
      answer: { type: String, required: true },
    },
  ],
  submittedAt: { type: Date, default: Date.now },
})

export default mongoose.models.ExamResponse || mongoose.model("ExamResponse", examResponseSchema)
