import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: String,
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
