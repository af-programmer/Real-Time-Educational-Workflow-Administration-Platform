-- Migration: add id_number field to students
USE eduflow;
ALTER TABLE students ADD COLUMN id_number VARCHAR(20) DEFAULT NULL UNIQUE AFTER name;
