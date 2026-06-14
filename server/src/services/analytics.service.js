const analyticsDAL = require('../dal/analytics.dal');

async function getGradesByClass() {
  return analyticsDAL.getGradesByClass();
}

async function getPrintRequestsByMonth() {
  return analyticsDAL.getPrintRequestsByMonth();
}

module.exports = { getGradesByClass, getPrintRequestsByMonth };
