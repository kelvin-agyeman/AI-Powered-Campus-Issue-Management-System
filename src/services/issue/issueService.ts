import Issue from "../../models/Issue";
import {
  IssueServiceCreateInput,
  UpdateIssueType,
} from "../../types/issue.types";
import { Types } from "mongoose";
import * as aiService from "../ai/aiService";
import { detectDuplicate } from "../duplicate/duplicateDetectionService";

export const createIssue = async (inputData: IssueServiceCreateInput) => {
  let issue = await Issue.create({
    ...inputData,
    aiStatus: "processing",
  });

  try {
    const aiResult = await aiService.analyzeIssue(
      issue.description,
      issue.location,
    );

    const duplicateResult = await detectDuplicate(
      issue._id,
      issue.description,
      issue.location,
      aiResult.aiRecommendation?.category,
      aiResult.aiRecommendation?.priority,
      aiResult.aiRecommendation?.summary,
    );

    issue = (await Issue.findByIdAndUpdate(
      issue._id,
      {
        aiRecommendation: aiResult.aiRecommendation,
        resolutionSupport: aiResult.resolutionSupport,
        aiModel: aiResult.model,
        duplicateAnalysis: duplicateResult?.duplicateAnalysis || {
          isDuplicate: false,
          duplicateScore: 0,
          reasoning: "No recent issues exist in the database for comparison.",
          possibleDuplicateOf: null,
        },
        aiStatus: "completed",
      },
      { returnDocument: "after", runValidators: true },
    )) as any;
  } catch (error) {
    console.error("AI/Duplicate Analysis failed on creation:", error);
    issue = (await Issue.findByIdAndUpdate(
      issue._id,
      { aiStatus: "failed" },
      { returnDocument: "after" },
    )) as any;
  }

  return issue;
};

export const updateIssue = async (
  issueId: string,
  studentId: Types.ObjectId,
  updateData: UpdateIssueType,
) => {
  const requiresAiRerun =
    updateData.description !== undefined || updateData.location !== undefined;

  let issue = await Issue.findOneAndUpdate(
    {
      _id: issueId,
      reportedBy: studentId,
      status: "pending_admin_review",
      isDeleted: false,
    },
    {
      ...updateData,
      ...(requiresAiRerun && { aiStatus: "processing" }),
    },
    { returnDocument: "after", runValidators: true },
  );

  if (!issue) {
    return null;
  }

  if (requiresAiRerun) {
    try {
      const aiResult = await aiService.analyzeIssue(
        issue.description,
        issue.location,
      );

      const duplicateResult = await detectDuplicate(
        issue._id,
        issue.description,
        issue.location,
        aiResult.aiRecommendation?.category,
        aiResult.aiRecommendation?.priority,
        aiResult.aiRecommendation?.summary,
      );

      issue = (await Issue.findByIdAndUpdate(
        issueId,
        {
          aiRecommendation: aiResult.aiRecommendation,
          resolutionSupport: aiResult.resolutionSupport,
          aiModel: aiResult.model,
          duplicateAnalysis: duplicateResult?.duplicateAnalysis || {
            isDuplicate: false,
            duplicateScore: 0,
            reasoning: "No recent issues exist in the database for comparison.",
            possibleDuplicateOf: null,
          },
          aiStatus: "completed",
        },
        { returnDocument: "after" },
      )) as any;
    } catch (error) {
      console.error(
        "AI/Duplicate Analysis failed during update execution:",
        error,
      );

      issue = (await Issue.findByIdAndUpdate(
        issueId,
        { aiStatus: "failed" },
        { returnDocument: "after" },
      )) as any;
    }
  }

  return issue;
};

export const findIssueById = async (issueId: string | string[]) => {
  return await Issue.findOne({ _id: issueId, isDeleted: false })
    .populate("reportedBy", "fullName institutionId")
    .populate("assignedDepartment")
    .populate("assignedStaff", "fullName");
};

export const findIssuesByStudent = async (studentId: Types.ObjectId) => {
  return await Issue.find({ reportedBy: studentId, isDeleted: false }).sort(
    "-createdAt",
  );
};

export const softDeleteIssue = async (
  issueId: string | string[],
  studentId: Types.ObjectId,
) => {
  return await Issue.findOneAndUpdate(
    { _id: issueId, reportedBy: studentId, status: "pending_admin_review" },
    { isDeleted: true },
    { returnDocument: "after" },
  );
};

export const restoreIssue = async (
  issueId: string | string[],
  studentId: Types.ObjectId,
) => {
  return await Issue.findOneAndUpdate(
    { _id: issueId, reportedBy: studentId, isDeleted: true },
    { isDeleted: false },
    { returnDocument: "after" },
  );
};
