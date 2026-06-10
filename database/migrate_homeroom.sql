-- Migration: add homeroom teacher support
USE eduflow;
ALTER TABLE users
  ADD COLUMN is_homeroom       BOOLEAN DEFAULT FALSE AFTER phone2,
  ADD COLUMN homeroom_class_id INT     DEFAULT NULL  AFTER is_homeroom,
  ADD CONSTRAINT fk_homeroom_class
    FOREIGN KEY (homeroom_class_id) REFERENCES classes(id) ON DELETE SET NULL;
