import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    status: { type: String, enum: ["todo", "in-progress", "completed"], default: "todo" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    organization: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    dueDate: Date,
    category: { type: String, enum: ["bug", "feature", "improvement"], default: "feature" },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);