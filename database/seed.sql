-- EduFlow Seed Data
USE eduflow;

-- ============================================================
-- ROLES
-- ============================================================
INSERT INTO roles (name) VALUES ('admin'), ('secretary'), ('teacher')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ============================================================
-- SUBJECTS
-- ============================================================
INSERT INTO subjects (name, description) VALUES
  ('Mathematics', 'Algebra, Geometry, Calculus'),
  ('Science', 'Physics, Chemistry, Biology'),
  ('English', 'Literature, Grammar, Writing'),
  ('History', 'World History, Civics'),
  ('Geography', 'Physical and Human Geography'),
  ('Art', 'Drawing, Painting, Sculpture'),
  ('Physical Education', 'Sports and Physical Fitness'),
  ('Computer Science', 'Programming, Technology')
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- ============================================================
-- CLASSES
-- ============================================================
INSERT INTO classes (name, student_count, grade_level, academic_year) VALUES
  ('A1', 28, '10th', '2025-2026'),
  ('A2', 31, '10th', '2025-2026'),
  ('B1', 25, '11th', '2025-2026'),
  ('B2', 29, '11th', '2025-2026'),
  ('C1', 27, '12th', '2025-2026'),
  ('C2', 30, '12th', '2025-2026')
ON DUPLICATE KEY UPDATE student_count = VALUES(student_count);

-- ============================================================
-- USERS (passwords are all: Password123!)
-- bcrypt hash of "Password123!"
-- ============================================================
INSERT INTO users (name, email, password_hash, role_id, is_active) VALUES
  (
    'System Admin',
    'admin@eduflow.com',
    '$2a$12$Pe2jZy8Ja65LqDM6HCPV4egIT1zkp03o4ckmdTcz0Q8QvZHC9DF4q',
    (SELECT id FROM roles WHERE name = 'admin'),
    TRUE
  ),
  (
    'Sarah Cohen',
    'secretary@eduflow.com',
    '$2a$12$Pe2jZy8Ja65LqDM6HCPV4egIT1zkp03o4ckmdTcz0Q8QvZHC9DF4q',
    (SELECT id FROM roles WHERE name = 'secretary'),
    TRUE
  ),
  (
    'David Levi',
    'teacher1@eduflow.com',
    '$2a$12$Pe2jZy8Ja65LqDM6HCPV4egIT1zkp03o4ckmdTcz0Q8QvZHC9DF4q',
    (SELECT id FROM roles WHERE name = 'teacher'),
    TRUE
  ),
  (
    'Maya Goldstein',
    'teacher2@eduflow.com',
    '$2a$12$Pe2jZy8Ja65LqDM6HCPV4egIT1zkp03o4ckmdTcz0Q8QvZHC9DF4q',
    (SELECT id FROM roles WHERE name = 'teacher'),
    TRUE
  ),
  (
    'Ron Shapiro',
    'teacher3@eduflow.com',
    '$2a$12$Pe2jZy8Ja65LqDM6HCPV4egIT1zkp03o4ckmdTcz0Q8QvZHC9DF4q',
    (SELECT id FROM roles WHERE name = 'teacher'),
    TRUE
  )
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ============================================================
-- TEACHER → CLASSES ASSIGNMENTS
-- ============================================================
INSERT INTO teacher_classes (teacher_id, class_id)
SELECT u.id, c.id FROM users u, classes c
WHERE u.email = 'teacher1@eduflow.com' AND c.name IN ('A1', 'A2')
ON DUPLICATE KEY UPDATE teacher_id = teacher_id;

INSERT INTO teacher_classes (teacher_id, class_id)
SELECT u.id, c.id FROM users u, classes c
WHERE u.email = 'teacher2@eduflow.com' AND c.name IN ('B1', 'B2')
ON DUPLICATE KEY UPDATE teacher_id = teacher_id;

INSERT INTO teacher_classes (teacher_id, class_id)
SELECT u.id, c.id FROM users u, classes c
WHERE u.email = 'teacher3@eduflow.com' AND c.name IN ('C1', 'C2')
ON DUPLICATE KEY UPDATE teacher_id = teacher_id;

-- ============================================================
-- TEACHER → SUBJECTS ASSIGNMENTS
-- ============================================================
INSERT INTO teacher_subjects (teacher_id, subject_id)
SELECT u.id, s.id FROM users u, subjects s
WHERE u.email = 'teacher1@eduflow.com' AND s.name IN ('Mathematics', 'Science')
ON DUPLICATE KEY UPDATE teacher_id = teacher_id;

INSERT INTO teacher_subjects (teacher_id, subject_id)
SELECT u.id, s.id FROM users u, subjects s
WHERE u.email = 'teacher2@eduflow.com' AND s.name IN ('English', 'History')
ON DUPLICATE KEY UPDATE teacher_id = teacher_id;

INSERT INTO teacher_subjects (teacher_id, subject_id)
SELECT u.id, s.id FROM users u, subjects s
WHERE u.email = 'teacher3@eduflow.com' AND s.name IN ('Computer Science', 'Mathematics')
ON DUPLICATE KEY UPDATE teacher_id = teacher_id;

-- ============================================================
-- SAMPLE STUDENTS for class A1
-- ============================================================
INSERT INTO classes (name, student_count, grade_level, academic_year)
VALUES ('A1', 28, '10th', '2025-2026')
ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id);

SET @a1_id = (SELECT id FROM classes WHERE name = 'A1');

INSERT INTO students (name, class_id, student_number) VALUES
  ('Alice Johnson', @a1_id, 'S001'),
  ('Bob Williams', @a1_id, 'S002'),
  ('Carol Davis', @a1_id, 'S003'),
  ('Daniel Miller', @a1_id, 'S004'),
  ('Eva Wilson', @a1_id, 'S005'),
  ('Frank Moore', @a1_id, 'S006'),
  ('Grace Taylor', @a1_id, 'S007'),
  ('Henry Anderson', @a1_id, 'S008'),
  ('Iris Thomas', @a1_id, 'S009'),
  ('Jack Jackson', @a1_id, 'S010')
ON DUPLICATE KEY UPDATE name = VALUES(name);
