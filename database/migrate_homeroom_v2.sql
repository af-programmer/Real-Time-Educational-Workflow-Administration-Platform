-- Migration: replace homeroom_class_id with many-to-many table
USE eduflow;

ALTER TABLE users DROP FOREIGN KEY fk_homeroom_class;
ALTER TABLE users DROP COLUMN homeroom_class_id;

CREATE TABLE IF NOT EXISTS teacher_homeroom_classes (
  teacher_id INT NOT NULL,
  class_id   INT NOT NULL,
  PRIMARY KEY (teacher_id, class_id),
  FOREIGN KEY (teacher_id) REFERENCES users(id)   ON DELETE CASCADE,
  FOREIGN KEY (class_id)   REFERENCES classes(id) ON DELETE CASCADE
);
