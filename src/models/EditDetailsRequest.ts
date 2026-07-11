import mongoose from "mongoose";

const EditDetailsRequestSchema = new mongoose.Schema(
  {
    requestedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },

    newInstitutionId: {
      type: String,
    },

    reason: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export default mongoose.model("EditDetailsRequest", EditDetailsRequestSchema);
