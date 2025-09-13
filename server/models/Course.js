import { Schema, model } from "mongoose";

const courseSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);


courseSchema.index({ code: 1 }, { unique: true });

const Course = model("Course", courseSchema);
export default Course;
