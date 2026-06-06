function calculateTotalCopies(classes) {
  // classes: [{ class_id, student_count }]
  return classes.reduce((total, cls) => total + (parseInt(cls.student_count) || 0), 0);
}

module.exports = { calculateTotalCopies };
