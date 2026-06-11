-- Allow library files to be categorized as "Others" (no subject)
USE eduflow;

ALTER TABLE teacher_library MODIFY subject_id INT NULL;
