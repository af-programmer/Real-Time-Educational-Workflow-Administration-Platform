const analyticsDAL = require('../dal/analytics.dal');
const asyncWrapper = require('../utils/asyncWrapper');

const getGradesAnalytics = asyncWrapper(async (req, res) => {
  const data = await analyticsDAL.getGradesByClass();
  res.json({ success: true, data });
});

const getPrintRequestsAnalytics = asyncWrapper(async (req, res) => {
  const data = await analyticsDAL.getPrintRequestsByMonth();
  res.json({ success: true, data });
});

module.exports = { getGradesAnalytics, getPrintRequestsAnalytics };
