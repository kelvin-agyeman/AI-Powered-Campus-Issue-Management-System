import mongoose from "mongoose";
import {
  ASSIGNABLE_DEPARTMENTS,
  PRIORITY_LEVELS,
  ISSUE_STATUSES,
  ISSUE_CATEGORIES,
} from "../utils/constants";

const IssueSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    images: {
      type: [
        {
          url: {
            type: String,
          },
          publicId: {
            type: String,
          },
        },
      ],
      default: [],
    },

    reportedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    aiModel: {
      type: String,
      default: "openai/gpt-oss-120b",
    },

    aiRecommendation: {
      category: {
        type: String,
        enum: ISSUE_CATEGORIES,
      },
      department: {
        type: String,
        enum: ASSIGNABLE_DEPARTMENTS,
      },
      priority: {
        type: String,
        enum: PRIORITY_LEVELS,
      },
      confidenceScore: {
        type: Number,
        min: 0,
        max: 100,
      },
      title: {
        type: String,
        trim: true,
      },
      summary: {
        type: String,
        trim: true,
      },
      reasoning: {
        type: String,
        trim: true,
      },
      requiresHumanReview: {
        type: Boolean,
      },
    },

    resolutionSupport: {
      recommendedAction: {
        type: String,
        trim: true,
      },

      requiredResources: {
        type: [String],
        default: [],
      },

      estimatedResolutionTime: {
        type: String,
        trim: true,
      },

      safetyNotes: {
        type: [String],
        default: [],
      },
    },

    aiStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },

    status: {
      type: String,
      enum: ISSUE_STATUSES,
      default: "pending_admin_review",
      index: true,
    },

    assignedDepartment: {
      type: String,
      enum: ASSIGNABLE_DEPARTMENTS,
      index: true,
    },

    assignedStaff: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      index: true,
    },

    assignedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },

    assignedAt: {
      type: Date,
    },

    acceptedAt: {
      type: Date,
    },

    progressUpdates: {
      type: [
        {
          note: {
            type: String,
            required: true,
            trim: true,
          },

          status: {
            type: String,
            enum: ISSUE_STATUSES,
          },

          updatedBy: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
          },

          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },

    reviewedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },

    reviewedAt: {
      type: Date,
    },

    adminDecision: {
      type: String,
      enum: ["approved", "modified", "rejected"],
    },

    priority: {
      type: String,
      enum: PRIORITY_LEVELS,
      index: true,
    },

    category: {
      type: String,
      enum: ISSUE_CATEGORIES,
    },

    resolutionNotes: {
      type: String,
      trim: true,
    },

    resolutionImages: {
      type: [
        {
          url: {
            type: String,
          },
          publicId: {
            type: String,
          },
        },
      ],
      default: [],
    },

    isResolved: {
      type: Boolean,
      default: false,
    },

    resolvedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      index: true,
    },

    resolvedAt: {
      type: Date,
    },

    rejectionReason: {
      type: String,
      trim: true,
    },

    duplicateAnalysis: {
      isDuplicate: {
        type: Boolean,
        default: false,
      },

      duplicateScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },

      reasoning: {
        type: String,
        trim: true,
      },

      possibleDuplicateOf: {
        type: mongoose.Types.ObjectId,
        ref: "Issue",
      },
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Issue", IssueSchema);
