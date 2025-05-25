import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    inviteCodes: [
      {
        code: { type: String, required: true },
        role: { type: String, enum: ["manager", "member"], default: "member" },
        email: { type: String }, // optional, for email-specific invites
        createdAt: { type: Date, default: Date.now }
      },
    ],
  },
  { timestamps: true }
);

const Organization = mongoose.model("Organization", organizationSchema);
export default Organization;