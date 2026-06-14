const teacherAssignmentsDAL = require('../dal/teacherAssignments.dal');

async function getHomeroomTeachersForEducator(userId) {
  const homeroomClasses = await teacherAssignmentsDAL.getHomeroomClasses(userId);
  if (!homeroomClasses.length) return [];
  const teacherSets = await Promise.all(
    homeroomClasses.map((c) => teacherAssignmentsDAL.getTeachersByClass(c.id))
  );
  const seen = new Set([userId]);
  return teacherSets.flat().filter((t) => !seen.has(t.id) && seen.add(t.id));
}

async function getTeacherClasses(userId) {
  return teacherAssignmentsDAL.getTeacherClasses(userId);
}

async function getTeacherSubjects(userId) {
  return teacherAssignmentsDAL.getTeacherSubjects(userId);
}

module.exports = { getHomeroomTeachersForEducator, getTeacherClasses, getTeacherSubjects };
