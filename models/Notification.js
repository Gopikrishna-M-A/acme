import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  schedule: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  target: {
    type: String,
    required: true,
    enum: ["everyone", "specific"],
    default: "everyone",
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: function () {
      return this.target === "specific";
    },
  },
  icon: {
    type: String,
    required: true,
    enum: ["CalendarIcon", "ClipboardCheckIcon", "CircleAlertIcon"],
  },
});

const Notification = mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);

export default Notification;
