
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
  ((SELECT id FROM users WHERE email = 'admin@eduflow.com'),     '$2a$12$y8htSJCWQSWLXzd28DD1X.O7d68CWxGDPzbqr2WVviba8.lAa7coO'),
  ((SELECT id FROM users WHERE email = 'secretary@eduflow.com'), '$2a$12$y8htSJCWQSWLXzd28DD1X.O7d68CWxGDPzbqr2WVviba8.lAa7coO'),
  ((SELECT id FROM users WHERE email = 'teacher1@eduflow.com'),  '$2a$12$y8htSJCWQSWLXzd28DD1X.O7d68CWxGDPzbqr2WVviba8.lAa7coO'),
  ((SELECT id FROM users WHERE email = 'teacher2@eduflow.com'),  '$2a$12$y8htSJCWQSWLXzd28DD1X.O7d68CWxGDPzbqr2WVviba8.lAa7coO'),
  ((SELECT id FROM users WHERE email = 'teacher3@eduflow.com'),  '$2a$12$y8htSJCWQSWLXzd28DD1X.O7d68CWxGDPzbqr2WVviba8.lAa7coO')
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
-- QUOTES
-- ============================================================
INSERT INTO quotes (role, text) VALUES
  ('admin',     'Leadership is not about rank or title — it is about influence, impact, and the inspiration you spark in others.'),
  ('admin',     'Education is not the filling of a vessel, but the kindling of a flame.'),
  ('admin',     'A great principal builds people, not just systems.'),
  ('admin',     'The best way to predict the future of your institution is to create it together with your team.'),
  ('admin',     'A leader''s success is measured by the number of people they grow, not the number of people who work under them.'),
  ('admin',     'Vision without action is merely a dream. Action without vision is just passing time. Vision combined with action can change reality.'),
  ('admin',     'Organizational culture is not written on the walls — it is rebuilt every day through respect, listening, and personal example.'),
  ('admin',     'A principal''s role is not to prevent storms, but to teach the team to sail together even when the sea is rough.'),
  ('teacher',   'Every child needs at least one adult who believes in them unconditionally.'),
  ('teacher',   'A mediocre teacher tells. A good teacher explains. A great teacher demonstrates. An exceptional teacher inspires.'),
  ('teacher',   'Education is the means by which we help a person become everything they are capable of being.'),
  ('teacher',   'The influence of a great teacher echoes forever — you can never know where it ends.'),
  ('teacher',   'Teaching is not my profession — teaching is my purpose.'),
  ('teacher',   'The words you say to a student today become the inner voice they carry tomorrow.'),
  ('teacher',   'Never give up on a student — you never know what success story they are about to write.'),
  ('teacher',   'Meaningful teaching begins the moment a student feels truly seen, even before their knowledge is tested.'),
  ('teacher',   'Patience is the root of all pedagogical success; the seeds you plant today may bloom only years from now.'),
  ('secretary', 'A smile and a kind word are the keys that open every door in a school.'),
  ('secretary', 'Order and organisation are the foundation on which great educational work grows.'),
  ('secretary', 'Courtesy in service is not just a duty — it is the way we make the workplace better for everyone.'),
  ('secretary', 'The small details are the ones that create the big, successful picture.'),
  ('secretary', 'A strong office team is the backbone that keeps the entire educational system standing tall.'),
  ('secretary', 'Behind every successful school stands an office team that handles the small details with professionalism and calm.'),
  ('secretary', 'The way you answer the phone or greet someone at the desk is the showcase of the entire institution.'),
  ('secretary', 'Efficiency and order in the office create the peace of mind that lets teachers teach and leaders lead.'),
  ('secretary', 'Where there is order, there is room to grow.')
ON DUPLICATE KEY UPDATE text = VALUES(text);

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

