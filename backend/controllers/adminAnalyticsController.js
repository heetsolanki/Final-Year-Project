const User = require("../models/User");
const Expert = require("../models/Expert");
const Query = require("../models/Query");
const Consultation = require("../models/Consultation");
const Payment = require("../models/Payment");

const CATEGORY_ORDER = [
  "Shopping & Marketplace",
  "Banking & Finance",
  "Product Defects",
  "Warranty Issues",
  "E-Commerce Fraud",
  "Others",
];

const STATUS_ORDER = ["Under Review", "Answered", "Unanswered", "Rejected"];

const mapRawStatusToDashboardStatus = (status) => {
  if (["In Review", "Assigned"].includes(status)) return "Under Review";
  if (["Answered", "Resolved"].includes(status)) return "Answered";
  if (status === "Rejected") return "Rejected";
  return "Unanswered";
};

const getCountFromAggregate = async (model, match = {}) => {
  const result = await model.aggregate([
    { $match: match },
    { $count: "total" },
  ]);

  return result[0]?.total || 0;
};

exports.getAdminAnalytics = async (req, res) => {
  try {
    const [users, experts, queries, consultations, payments, rawCategoryGroups, rawStatusGroups] = await Promise.all([
      getCountFromAggregate(User, { role: "consumer" }),
      getCountFromAggregate(Expert, { role: "legalExpert" }),
      getCountFromAggregate(Query),
      getCountFromAggregate(Consultation),
      getCountFromAggregate(Payment),
      Query.aggregate([
        {
          $group: {
            _id: {
              $cond: [
                {
                  $or: [
                    { $eq: ["$category", null] },
                    { $eq: [{ $trim: { input: { $ifNull: ["$category", ""] } } }, ""] },
                  ],
                },
                "Others",
                "$category",
              ],
            },
            count: { $sum: 1 },
          },
        },
      ]),
      Query.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const categoryCountMap = rawCategoryGroups.reduce((acc, item) => {
      const category = item?._id || "Others";
      acc[category] = (acc[category] || 0) + item.count;
      return acc;
    }, {});

    const knownCategoryTotal = CATEGORY_ORDER.reduce(
      (sum, category) => sum + (categoryCountMap[category] || 0),
      0,
    );

    const totalCategoryCount = Object.values(categoryCountMap).reduce((sum, count) => sum + count, 0);
    const uncategorizedCount = Math.max(totalCategoryCount - knownCategoryTotal, 0);

    const queriesByCategory = CATEGORY_ORDER.map((category) => ({
      category,
      count:
        category === "Others"
          ? (categoryCountMap[category] || 0) + uncategorizedCount
          : categoryCountMap[category] || 0,
    }));

    const rawMappedStatuses = rawStatusGroups.map((item) => ({
      status: mapRawStatusToDashboardStatus(item?._id),
      count: item.count,
    }));

    const statusCountMap = rawMappedStatuses.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + item.count;
      return acc;
    }, {});

    const queriesByStatus = STATUS_ORDER.map((status) => ({
      status,
      count: statusCountMap[status] || 0,
    }));

    const queriesPerCategoryBar = queriesByCategory.map((item) => ({
      category: item.category,
      count: item.count,
    }));

    const mostCommonCategoryItem = queriesByCategory.reduce(
      (top, current) => (current.count > top.count ? current : top),
      { category: "N/A", count: 0 },
    );

    const answeredCount = statusCountMap.Answered || 0;
    const answeredPercentage = queries > 0 ? Math.round((answeredCount / queries) * 100) : 0;
    const avgQueriesPerUser = users > 0 ? Number((queries / users).toFixed(1)) : 0;

    res.status(200).json({
      stats: {
        users,
        experts,
        queries,
        consultations,
        payments,
      },
      queriesByCategory,
      queriesByStatus,
      queriesPerCategoryBar,
      insights: {
        mostCommonCategory: mostCommonCategoryItem.category,
        answeredPercentage,
        avgQueriesPerUser,
        totalActiveExperts: experts,
      },
    });
  } catch (error) {
    console.error("Admin analytics error:", error);
    res.status(500).json({ message: "Failed to fetch admin analytics" });
  }
};
