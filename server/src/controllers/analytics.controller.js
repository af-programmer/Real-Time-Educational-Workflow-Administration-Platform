const analyticsService = require('../services/analytics.service');
const asyncWrapper = require('../utils/asyncWrapper');

const getGradesAnalytics = asyncWrapper(async (req, res) => {
  const data = await analyticsService.getGradesByClass();
  res.json({ success: true, data });
});

const getPrintRequestsAnalytics = asyncWrapper(async (req, res) => {
  const data = await analyticsService.getPrintRequestsByMonth();
  res.json({ success: true, data });
});

module.exports = { getGradesAnalytics, getPrintRequestsAnalytics };
