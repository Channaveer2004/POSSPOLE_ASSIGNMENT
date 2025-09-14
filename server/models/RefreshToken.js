import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tokenHash: { type: String, required: true }, // store hashed token
    userAgent: String,
    ip: String,
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.RefreshToken || mongoose.model("RefreshToken", refreshTokenSchema);
