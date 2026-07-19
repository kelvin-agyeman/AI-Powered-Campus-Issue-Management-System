import Issue from "../../models/Issue";
import User from "../../models/User";
import {
  DepartmentAnalyticsResult,
  CategoryAnalyticsResult,
  PriorityAnalyticsResult,
  ResolutionTimeResult,
  StaffPerformanceResult,
  DuplicateAnalyticsResult,
  AiDecisionAnalyticsResult,
} from "../../types/analytics.types";

export const getDashboardStats = async () => {
  const statusOverview = await Issue.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const categoryTrends = await Issue.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  const staffWorkload = await Issue.aggregate([
    {
      $match: { isDeleted: false, assignedStaff: { $exists: true, $ne: null } },
    },
    {
      $group: {
        _id: "$assignedStaff",
        activeIssues: {
          $sum: { $cond: [{ $eq: ["$isResolved", false] }, 1, 0] },
        },
        resolvedIssues: {
          $sum: { $cond: [{ $eq: ["$isResolved", true] }, 1, 0] },
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "staffDetails",
      },
    },
    { $unwind: "$staffDetails" },
    {
      $project: {
        _id: 1,
        staffName: "$staffDetails.fullName",
        activeIssues: 1,
        resolvedIssues: 1,
      },
    },
  ]);

  const totalUsers = await User.countDocuments({ isActive: true });
  const totalIssues = await Issue.countDocuments({ isDeleted: false });

  const formattedStatus: Record<string, number> = {};
  statusOverview.forEach((item) => {
    formattedStatus[item._id] = item.count;
  });

  return {
    totals: {
      users: totalUsers,
      issues: totalIssues,
    },
    statusBreakdown: formattedStatus,
    categoryTrends,
    staffWorkload,
  };
};

export const getDepartmentAnalytics = async (): Promise<
  DepartmentAnalyticsResult[]
> => {
  return await Issue.aggregate([
    {
      $match: {
        isDeleted: false,
        assignedDepartment: { $exists: true, $ne: null },
      },
    },
    {
      $group: {
        _id: "$assignedDepartment",
        totalIssues: { $sum: 1 },
        activeIssues: {
          $sum: { $cond: [{ $eq: ["$isResolved", false] }, 1, 0] },
        },
        resolvedIssues: {
          $sum: { $cond: [{ $eq: ["$isResolved", true] }, 1, 0] },
        },
      },
    },
    { $sort: { totalIssues: -1 } },
    {
      $project: {
        _id: 0,
        department: "$_id",
        totalIssues: 1,
        activeIssues: 1,
        resolvedIssues: 1,
      },
    },
  ]);
};

export const getCategoryAnalytics = async (): Promise<
  CategoryAnalyticsResult[]
> => {
  return await Issue.aggregate([
    {
      $match: {
        isDeleted: false,
        category: { $exists: true, $ne: null },
      },
    },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    {
      $project: {
        _id: 0,
        category: "$_id",
        count: 1,
      },
    },
  ]);
};

export const getPriorityAnalytics = async (): Promise<
  PriorityAnalyticsResult[]
> => {
  return await Issue.aggregate([
    {
      $match: {
        isDeleted: false,
        priority: { $exists: true, $ne: null },
      },
    },
    {
      $group: {
        _id: "$priority",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    {
      $project: {
        _id: 0,
        priority: "$_id",
        count: 1,
      },
    },
  ]);
};

export const getResolutionTimeAnalytics = async (): Promise<
  ResolutionTimeResult[]
> => {
  return await Issue.aggregate([
    {
      $match: {
        isDeleted: false,
        isResolved: true,
        resolvedAt: { $exists: true, $type: "date" },
      },
    },
    {
      $group: {
        _id: "$category",
        avgTimeMs: { $avg: { $subtract: ["$resolvedAt", "$createdAt"] } },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id",

        averageResolutionHours: {
          $round: [{ $divide: ["$avgTimeMs", 3600000] }, 2],
        },
      },
    },
    { $sort: { averageResolutionHours: -1 } },
  ]);
};

export const getStaffPerformanceAnalytics = async (): Promise<
  StaffPerformanceResult[]
> => {
  return await Issue.aggregate([
    {
      $match: {
        isDeleted: false,
        assignedStaff: { $exists: true, $ne: null },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "assignedStaff",
        foreignField: "_id",
        as: "staff",
      },
    },
    { $unwind: "$staff" },
    {
      $group: {
        _id: "$assignedStaff",
        staffName: { $first: "$staff.fullName" },
        resolvedCount: {
          $sum: { $cond: [{ $eq: ["$isResolved", true] }, 1, 0] },
        },
        activeCount: {
          $sum: { $cond: [{ $eq: ["$isResolved", false] }, 1, 0] },
        },

        avgResolutionTimeMs: {
          $avg: {
            $cond: [
              {
                $and: [
                  { $eq: ["$isResolved", true] },
                  { $ne: ["$resolvedAt", null] },
                ],
              },
              { $subtract: ["$resolvedAt", "$createdAt"] },
              null,
            ],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        staffId: "$_id",
        staffName: 1,
        resolvedCount: 1,
        activeCount: 1,
        averageResolutionHours: {
          $cond: [
            { $eq: ["$avgResolutionTimeMs", null] },
            null,
            { $round: [{ $divide: ["$avgResolutionTimeMs", 3600000] }, 2] },
          ],
        },
      },
    },
    { $sort: { resolvedCount: -1 } },
  ]);
};

export const getDuplicateAnalytics =
  async (): Promise<DuplicateAnalyticsResult> => {
    const result = await Issue.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: null,
          totalIssues: { $sum: 1 },
          duplicateIssues: {
            $sum: {
              $cond: [{ $eq: ["$duplicateAnalysis.isDuplicate", true] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalIssues: 1,
          duplicateIssues: 1,
          uniqueIssues: { $subtract: ["$totalIssues", "$duplicateIssues"] },
          duplicateRatePercentage: {
            $round: [
              {
                $multiply: [
                  {
                    $divide: [
                      "$duplicateIssues",
                      { $max: ["$totalIssues", 1] },
                    ],
                  },
                  100,
                ],
              },
              2,
            ],
          },
        },
      },
    ]);

    return result.length > 0
      ? result[0]
      : {
          totalIssues: 0,
          duplicateIssues: 0,
          uniqueIssues: 0,
          duplicateRatePercentage: 0,
        };
  };

export const getAiDecisionAnalytics =
  async (): Promise<AiDecisionAnalyticsResult> => {
    const result = await Issue.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: null,
          totalIssues: { $sum: 1 },
          aiAssistedCount: {
            $sum: { $cond: [{ $ifNull: ["$aiRecommendation", false] }, 1, 0] },
          },
          categoryMatches: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ["$aiRecommendation", null] },
                    { $eq: ["$category", "$aiRecommendation.category"] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          departmentMatches: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ["$aiRecommendation", null] },
                    {
                      $eq: [
                        "$assignedDepartment",
                        "$aiRecommendation.department",
                      ],
                    },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalIssues: 1,
          aiAssistedCount: 1,
          // Calculate percentages safely (avoiding division by zero)
          categoryMatchRate: {
            $cond: [
              { $eq: ["$aiAssistedCount", 0] },
              0,
              {
                $round: [
                  {
                    $multiply: [
                      { $divide: ["$categoryMatches", "$aiAssistedCount"] },
                      100,
                    ],
                  },
                  1,
                ],
              },
            ],
          },
          departmentMatchRate: {
            $cond: [
              { $eq: ["$aiAssistedCount", 0] },
              0,
              {
                $round: [
                  {
                    $multiply: [
                      { $divide: ["$departmentMatches", "$aiAssistedCount"] },
                      100,
                    ],
                  },
                  1,
                ],
              },
            ],
          },
        },
      },
      {
        $addFields: {
          overallAccuracy: {
            $round: [
              {
                $divide: [
                  { $add: ["$categoryMatchRate", "$departmentMatchRate"] },
                  2,
                ],
              },
              1,
            ],
          },
        },
      },
    ]);

    return result.length > 0
      ? result[0]
      : {
          totalIssues: 0,
          aiAssistedCount: 0,
          categoryMatchRate: 0,
          departmentMatchRate: 0,
          overallAccuracy: 0,
        };
  };
