-- EduFlow Seed Data
USE eduflow;

-- ============================================================
-- ROLES
-- ============================================================
INSERT INTO roles (name) VALUES ('admin'), ('secretary'), ('teacher')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ============================================================
-- GRADE LEVELS
-- ============================================================
INSERT INTO grade_levels (code, label) VALUES
  ('9',  '9th Grade'),
  ('10', '10th Grade'),
  ('11', '11th Grade'),
  ('12', '12th Grade')
ON DUPLICATE KEY UPDATE label = VALUES(label);

-- ============================================================
-- PRINT PRIORITIES
-- ============================================================
INSERT INTO print_priorities (code, label, sort_order) VALUES
  ('normal',    'Normal',    3),
  ('important', 'Important', 2),
  ('urgent',    'Urgent',    1)
ON DUPLICATE KEY UPDATE label = VALUES(label);

-- ============================================================
-- PRINT STATUSES
-- ============================================================
INSERT INTO print_statuses (code, label, sort_order) VALUES
  ('pending',     'Pending',     1),
  ('in_progress', 'In Progress', 2),
  ('printed',     'Printed',     3),
  ('completed',   'Completed',   4)
ON DUPLICATE KEY UPDATE label = VALUES(label);

-- ============================================================
-- EXAM TYPES
-- ============================================================
INSERT INTO exam_types (code, label) VALUES
  ('test',     'Test'),
  ('quiz',     'Quiz'),
  ('midterm',  'Midterm Exam'),
  ('final',    'Final Exam'),
  ('homework', 'Homework')
ON DUPLICATE KEY UPDATE label = VALUES(label);

-- ============================================================
-- SUBJECTS
-- ============================================================
INSERT INTO subjects (name, description) VALUES
  ('Mathematics',        'Algebra, Geometry, Calculus'),
  ('Science',            'Physics, Chemistry, Biology'),
  ('English',            'Literature, Grammar, Writing'),
  ('History',            'World History, Civics'),
  ('Geography',          'Physical and Human Geography'),
  ('Art',                'Drawing, Painting, Sculpture'),
  ('Physical Education', 'Sports and Physical Fitness'),
  ('Computer Science',   'Programming, Technology')
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- ============================================================
-- CLASSES
-- ============================================================
INSERT INTO classes (name, student_count, grade_level_id, academic_year) VALUES
  ('A1', 28, (SELECT id FROM grade_levels WHERE code = '10'), '2025-2026'),
  ('A2', 31, (SELECT id FROM grade_levels WHERE code = '10'), '2025-2026'),
  ('B1', 25, (SELECT id FROM grade_levels WHERE code = '11'), '2025-2026'),
  ('B2', 29, (SELECT id FROM grade_levels WHERE code = '11'), '2025-2026'),
  ('C1', 27, (SELECT id FROM grade_levels WHERE code = '12'), '2025-2026'),
  ('C2', 30, (SELECT id FROM grade_levels WHERE code = '12'), '2025-2026')
ON DUPLICATE KEY UPDATE student_count = VALUES(student_count);

-- ============================================================
-- USERS  (passwords are all: Password123!)
-- bcrypt hash of "Password123!"
-- ============================================================
INSERT INTO users (name, email, role_id, is_active) VALUES
  ('System Admin',   'admin@eduflow.com',     (SELECT id FROM roles WHERE name = 'admin'),     TRUE),
  ('Sarah Cohen',    'secretary@eduflow.com', (SELECT id FROM roles WHERE name = 'secretary'), TRUE),
  ('David Levi',     'teacher1@eduflow.com',  (SELECT id FROM roles WHERE name = 'teacher'),   TRUE),
  ('Maya Goldstein', 'teacher2@eduflow.com',  (SELECT id FROM roles WHERE name = 'teacher'),   TRUE),
  ('Ron Shapiro',    'teacher3@eduflow.com',  (SELECT id FROM roles WHERE name = 'teacher'),   TRUE)
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO user_credentials (user_id, password_hash) VALUES
  ((SELECT id FROM users WHERE email = 'admin@eduflow.com'),     '$2a$12$Pe2jZy8Ja65LqDM6HCPV4egIT1zkp03o4ckmdTcz0Q8QvZHC9DF4q'),
  ((SELECT id FROM users WHERE email = 'secretary@eduflow.com'), '$2a$12$Pe2jZy8Ja65LqDM6HCPV4egIT1zkp03o4ckmdTcz0Q8QvZHC9DF4q'),
  ((SELECT id FROM users WHERE email = 'teacher1@eduflow.com'),  '$2a$12$Pe2jZy8Ja65LqDM6HCPV4egIT1zkp03o4ckmdTcz0Q8QvZHC9DF4q'),
  ((SELECT id FROM users WHERE email = 'teacher2@eduflow.com'),  '$2a$12$Pe2jZy8Ja65LqDM6HCPV4egIT1zkp03o4ckmdTcz0Q8QvZHC9DF4q'),
  ((SELECT id FROM users WHERE email = 'teacher3@eduflow.com'),  '$2a$12$Pe2jZy8Ja65LqDM6HCPV4egIT1zkp03o4ckmdTcz0Q8QvZHC9DF4q')
ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash);

-- ============================================================
-- TEACHER → CLASSES ASSIGNMENTS
-- ============================================================
INSERT INTO teacher_classes (teacher_id, class_id)
SELECT u.id, c.id FROM users u, classes c
WHERE u.email = 'teacher1@eduflow.com' AND c.name IN ('A1', 'A2')
ON DUPLICATE KEY UPDATE assigned_at = assigned_at;

INSERT INTO teacher_classes (teacher_id, class_id)
SELECT u.id, c.id FROM users u, classes c
WHERE u.email = 'teacher2@eduflow.com' AND c.name IN ('B1', 'B2')
ON DUPLICATE KEY UPDATE assigned_at = assigned_at;

INSERT INTO teacher_classes (teacher_id, class_id)
SELECT u.id, c.id FROM users u, classes c
WHERE u.email = 'teacher3@eduflow.com' AND c.name IN ('C1', 'C2')
ON DUPLICATE KEY UPDATE assigned_at = assigned_at;

-- ============================================================
-- TEACHER → SUBJECTS ASSIGNMENTS
-- ============================================================
INSERT INTO teacher_subjects (teacher_id, subject_id)
SELECT u.id, s.id FROM users u, subjects s
WHERE u.email = 'teacher1@eduflow.com' AND s.name IN ('Mathematics', 'Science')
ON DUPLICATE KEY UPDATE assigned_at = assigned_at;

INSERT INTO teacher_subjects (teacher_id, subject_id)
SELECT u.id, s.id FROM users u, subjects s
WHERE u.email = 'teacher2@eduflow.com' AND s.name IN ('English', 'History')
ON DUPLICATE KEY UPDATE assigned_at = assigned_at;

INSERT INTO teacher_subjects (teacher_id, subject_id)
SELECT u.id, s.id FROM users u, subjects s
WHERE u.email = 'teacher3@eduflow.com' AND s.name IN ('Computer Science', 'Mathematics')
ON DUPLICATE KEY UPDATE assigned_at = assigned_at;

-- ============================================================
-- SAMPLE STUDENTS for class A1
-- at least one parent phone required (phone_father here)
-- ============================================================
SET @a1_id = (SELECT id FROM classes WHERE name = 'A1');

INSERT INTO students (name, class_id, student_number, phone_father) VALUES
  ('Alice Johnson',  @a1_id, 'S001', '050-1111111'),
  ('Bob Williams',   @a1_id, 'S002', '050-2222222'),
  ('Carol Davis',    @a1_id, 'S003', '050-3333333'),
  ('Daniel Miller',  @a1_id, 'S004', '050-4444444'),
  ('Eva Wilson',     @a1_id, 'S005', '050-5555555'),
  ('Frank Moore',    @a1_id, 'S006', '050-6666666'),
  ('Grace Taylor',   @a1_id, 'S007', '050-7777777'),
  ('Henry Anderson', @a1_id, 'S008', '050-8888888'),
  ('Iris Thomas',    @a1_id, 'S009', '050-9999999'),
  ('Jack Jackson',   @a1_id, 'S010', '050-1010101')
ON DUPLICATE KEY UPDATE name = VALUES(name);
