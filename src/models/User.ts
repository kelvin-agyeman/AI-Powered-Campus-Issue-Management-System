import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { KNUST_DEPARTMENTS } from "../utils/departments";

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      required: true,
      minLength: 3,
      maxLength: 50,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      index: true,
      required: function (this: any) {
        return this.role === "student" || this.role === "staff";
      },
    },

    role: {
      type: String,
      enum: ["student", "staff", "admin"],
      default: "student",
      required: true,
      immutable: true,
    },

    institutionId: {
      type: String,
      unique: true,
      sparse: true,
      required: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false, // Prevents accidental leakage
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    verifiedAt: {
      type: Date,
    },

    verificationToken: {
      type: String,
      select: false, // Prevents accidental leakage
    },

    verificationTokenExpirationDate: {
      type: Date,
    },

    resetPasswordToken: {
      type: String,
      select: false, // Prevents accidental leakage
    },

    resetPasswordTokenExpirationDate: {
      type: Date,
    },

    department: {
      type: String,
      enum: KNUST_DEPARTMENTS,
      required: function (this: any) {
        return this.role === "staff";
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    avatar: {
      type: String,
    },

    avatarPublicId: {
      type: String,
    },

    lastLogin: {
      type: Date,
    },

    passwordChangedAt: {
      type: Date,
    },

    lastPasswordResetRequest: {
      type: Date,
    },

    lastVerificationEmailSent: {
      type: Date,
    },

    failedLoginAttempts: {
      type: Number,
      default: 0,
    },

    lockUntil: Date,

    isDeleted: {
      type: Boolean,
      default: false,
    },

    newEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },

    newVerificationToken: {
      type: String,
      select: false,
    },

    newVerificationTokenExpirationDate: {
      type: Date,
    },
  },
  { timestamps: true },
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);

  if (this.password) {
    this.password = await bcrypt.hash(this.password, salt);
  }
});

UserSchema.methods.toJSON = function () {
  let obj = this.toObject();
  delete obj.password;
  return obj;
};

UserSchema.virtual("isLocked").get(function () {
  return !!(this.lockUntil && this.lockUntil > new Date());
});

export default mongoose.model("User", UserSchema);
