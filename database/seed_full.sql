-- ============================================================
-- EduFlow Full Seed Data  (v2 — with Educator role)
-- Password for ALL users: Password123!
-- bcrypt hash ($2a$12$...): $2a$12$y8htSJCWQSWLXzd28DD1X.O7d68CWxGDPzbqr2WVviba8.lAa7coO
-- Run: mysql -u root -p eduflow < database/seed_full.sql
-- WARNING: wipes all existing data first.
-- ============================================================
USE eduflow;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE grades;
TRUNCATE TABLE print_request_classes;
TRUNCATE TABLE print_files;
TRUNCATE TABLE print_requests;
TRUNCATE TABLE message_reads;
TRUNCATE TABLE message_deletes;
TRUNCATE TABLE messages;
TRUNCATE TABLE notification_reads;
TRUNCATE TABLE notifications;
TRUNCATE TABLE teacher_homeroom_classes;
TRUNCATE TABLE teacher_classes;
TRUNCATE TABLE teacher_subjects;
TRUNCATE TABLE teacher_library;
TRUNCATE TABLE students;
TRUNCATE TABLE user_credentials;
TRUNCATE TABLE users;
TRUNCATE TABLE classes;
TRUNCATE TABLE subjects;
TRUNCATE TABLE exam_types;
TRUNCATE TABLE print_statuses;
TRUNCATE TABLE print_priorities;
TRUNCATE TABLE grade_levels;
TRUNCATE TABLE quotes;
TRUNCATE TABLE roles;
SET FOREIGN_KEY_CHECKS = 1;

-- ── Roles ─────────────────────────────────────────────────────────────────────
INSERT INTO roles (name) VALUES
  ('admin'), ('secretary'), ('teacher'), ('Educator');

-- ── Grade levels ──────────────────────────────────────────────────────────────
INSERT INTO grade_levels (code, label) VALUES
  ('9',  '9th Grade'),
  ('10', '10th Grade'),
  ('11', '11th Grade'),
  ('12', '12th Grade');

-- ── Print priorities ──────────────────────────────────────────────────────────
INSERT INTO print_priorities (code, label, sort_order) VALUES
  ('urgent',    'Urgent',    1),
  ('important', 'Important', 2),
  ('normal',    'Normal',    3);

-- ── Print statuses ────────────────────────────────────────────────────────────
INSERT INTO print_statuses (code, label, sort_order) VALUES
  ('pending',     'Pending',     1),
  ('in_progress', 'In Progress', 2),
  ('printed',     'Printed',     3),
  ('completed',   'Completed',   4);

-- ── Exam types ────────────────────────────────────────────────────────────────
INSERT INTO exam_types (code, label) VALUES
  ('quiz',     'Quiz'),
  ('test',     'Test'),
  ('midterm',  'Midterm Exam'),
  ('final',    'Final Exam'),
  ('homework', 'Homework');

-- ── Quotes ────────────────────────────────────────────────────────────────────
INSERT INTO quotes (role, text) VALUES
  ('admin', 'Leadership is not about rank or title — it is about influence, impact, and the inspiration you spark in others.'),
  ('admin', 'Education is not the filling of a vessel, but the kindling of a flame.'),
  ('admin', 'A great principal builds people, not just systems.'),
  ('admin', 'Vision without action is merely a dream. Vision combined with action can change reality.'),
  ('admin', 'Organizational culture is rebuilt every day through respect, listening, and personal example.'),
  ('admin', 'A principal''s role is not to prevent storms, but to teach the team to sail together even when the sea is rough.'),
  ('admin', 'The best way to predict the future of your school is to build it together with your team.'),
  ('admin', 'A leader''s success is measured by the number of people they grow, not the number who work under them.'),
  ('teacher', 'Every child needs at least one adult who believes in them unconditionally.'),
  ('teacher', 'A mediocre teacher tells. A good teacher explains. An exceptional teacher inspires.'),
  ('teacher', 'The influence of a great teacher echoes forever — you can never know where it ends.'),
  ('teacher', 'Teaching is not my profession — teaching is my purpose.'),
  ('teacher', 'The words you say to a student today become the inner voice they carry tomorrow.'),
  ('teacher', 'Patience is the root of all pedagogical success; the seeds you plant today may bloom years from now.'),
  ('teacher', 'Never give up on a student — you never know what success story they are about to write.'),
  ('teacher', 'Meaningful teaching begins the moment a student feels truly seen.'),
  ('teacher', 'Education is the means by which we help a person become everything they are capable of being.'),
  ('secretary', 'A smile and a kind word are the keys that open every door in a school.'),
  ('secretary', 'Order and organisation are the foundation on which great educational work grows.'),
  ('secretary', 'Courtesy in service is not just a duty — it is the way we make the workplace better for everyone.'),
  ('secretary', 'The small details are the ones that create the big, successful picture.'),
  ('secretary', 'A strong office team is the backbone that keeps the entire educational system standing tall.'),
  ('secretary', 'Behind every successful school stands an office team that handles the small details with professionalism.'),
  ('secretary', 'The way you answer the phone is the showcase of the entire institution.'),
  ('secretary', 'Where there is order, there is room to grow.');

-- ── Subjects (8) ──────────────────────────────────────────────────────────────
INSERT INTO subjects (name, description) VALUES
  ('Mathematics',  'Algebra, Geometry, Calculus'),
  ('Physics',      'Mechanics, Electricity, Optics'),
  ('English',      'Literature, Grammar, Writing'),
  ('Literature',   'Hebrew Classical and Modern Texts'),
  ('History',      'World and Israeli History'),
  ('Geography',    'Physical and Human Geography'),
  ('Biology',      'Cell Biology, Genetics, Ecology'),
  ('Chemistry',    'Organic and Inorganic Chemistry');

-- ── Classes (4) ───────────────────────────────────────────────────────────────
INSERT INTO classes (name, student_count, grade_level_id, academic_year) VALUES
  ('9A',  22, (SELECT id FROM grade_levels WHERE code = '9'),  '2025-2026'),
  ('9B',  20, (SELECT id FROM grade_levels WHERE code = '9'),  '2025-2026'),
  ('10A', 24, (SELECT id FROM grade_levels WHERE code = '10'), '2025-2026'),
  ('10B', 21, (SELECT id FROM grade_levels WHERE code = '10'), '2025-2026');

-- ── Users (11 total) ──────────────────────────────────────────────────────────
-- 1 admin, 2 secretaries, 4 Educators, 4 professional teachers
-- All passwords: Password123!

INSERT INTO users (name, email, role_id, phone, phone2) VALUES
  -- Admin
  ('Roni Avraham',   'admin@gmail.com',   (SELECT id FROM roles WHERE name = 'admin'),           '03-6543210', NULL),
  -- Secretaries
  ('Dana Cohen',     'dana@gmail.com',    (SELECT id FROM roles WHERE name = 'secretary'),        '052-1234567', NULL),
  ('Noa Levi',       'noa@gmail.com',     (SELECT id FROM roles WHERE name = 'secretary'),        '053-2345678', NULL),
  -- Educators
  ('Yael Shapiro',   'yael@gmail.com',    (SELECT id FROM roles WHERE name = 'Educator'), '054-3456789', '050-1111111'),
  ('Avi Goldstein',  'avi@gmail.com',     (SELECT id FROM roles WHERE name = 'Educator'), '055-4567890', NULL),
  ('Miriam Katz',    'miriam@gmail.com',  (SELECT id FROM roles WHERE name = 'Educator'), '054-5678901', '052-9876543'),
  ('David Ben-David','david@gmail.com',   (SELECT id FROM roles WHERE name = 'Educator'), '053-6789012', NULL),
  -- Professional teachers
  ('Rachel Mizrahi', 'rachel@gmail.com',  (SELECT id FROM roles WHERE name = 'teacher'),          '052-7890123', NULL),
  ('Shlomo Peretz',  'shlomo@gmail.com',  (SELECT id FROM roles WHERE name = 'teacher'),          '054-8901234', NULL),
  ('Tamar Amar',     'tamar@gmail.com',   (SELECT id FROM roles WHERE name = 'teacher'),          '055-9012345', '050-2222222'),
  ('Eli Cohen',      'eli@gmail.com',     (SELECT id FROM roles WHERE name = 'teacher'),          '052-0123456', NULL);

-- ── Credentials (same hash for all) ──────────────────────────────────────────
INSERT INTO user_credentials (user_id, password_hash)
SELECT id, '$2a$12$y8htSJCWQSWLXzd28DD1X.O7d68CWxGDPzbqr2WVviba8.lAa7coO'
FROM users;

-- ── Homeroom class assignments ────────────────────────────────────────────────
INSERT INTO teacher_homeroom_classes (teacher_id, class_id)
SELECT u.id, c.id FROM users u, classes c
WHERE (u.email = 'yael@gmail.com'  AND c.name = '9A')
   OR (u.email = 'avi@gmail.com'   AND c.name = '9B')
   OR (u.email = 'miriam@gmail.com' AND c.name = '10A')
   OR (u.email = 'david@gmail.com' AND c.name = '10B');

-- ── Teaching class assignments ────────────────────────────────────────────────
-- Educators also teach in multiple classes:
-- Yael: Math in 9A + 9B
INSERT INTO teacher_classes (teacher_id, class_id)
SELECT u.id, c.id FROM users u, classes c
WHERE u.email = 'yael@gmail.com' AND c.name IN ('9A','9B');

-- Avi: English in 9A + 9B
INSERT INTO teacher_classes (teacher_id, class_id)
SELECT u.id, c.id FROM users u, classes c
WHERE u.email = 'avi@gmail.com' AND c.name IN ('9A','9B');

-- Miriam: History in 10A + 10B
INSERT INTO teacher_classes (teacher_id, class_id)
SELECT u.id, c.id FROM users u, classes c
WHERE u.email = 'miriam@gmail.com' AND c.name IN ('10A','10B');

-- David: Literature in 10A + 10B
INSERT INTO teacher_classes (teacher_id, class_id)
SELECT u.id, c.id FROM users u, classes c
WHERE u.email = 'david@gmail.com' AND c.name IN ('10A','10B');

-- Professional teachers — all 4 classes:
-- Rachel: Physics in all
INSERT INTO teacher_classes (teacher_id, class_id)
SELECT u.id, c.id FROM users u, classes c
WHERE u.email = 'rachel@gmail.com';

-- Shlomo: Geography in all
INSERT INTO teacher_classes (teacher_id, class_id)
SELECT u.id, c.id FROM users u, classes c
WHERE u.email = 'shlomo@gmail.com';

-- Tamar: Biology in 9A + 9B only
INSERT INTO teacher_classes (teacher_id, class_id)
SELECT u.id, c.id FROM users u, classes c
WHERE u.email = 'tamar@gmail.com' AND c.name IN ('9A','9B');

-- Eli: Chemistry in 10A + 10B only
INSERT INTO teacher_classes (teacher_id, class_id)
SELECT u.id, c.id FROM users u, classes c
WHERE u.email = 'eli@gmail.com' AND c.name IN ('10A','10B');

-- ── Subject assignments ───────────────────────────────────────────────────────
INSERT INTO teacher_subjects (teacher_id, subject_id)
SELECT u.id, s.id FROM users u, subjects s
WHERE (u.email = 'yael@gmail.com'   AND s.name = 'Mathematics')
   OR (u.email = 'avi@gmail.com'    AND s.name = 'English')
   OR (u.email = 'miriam@gmail.com' AND s.name = 'History')
   OR (u.email = 'david@gmail.com'  AND s.name = 'Literature')
   OR (u.email = 'rachel@gmail.com' AND s.name = 'Physics')
   OR (u.email = 'shlomo@gmail.com' AND s.name = 'Geography')
   OR (u.email = 'tamar@gmail.com'  AND s.name = 'Biology')
   OR (u.email = 'eli@gmail.com'    AND s.name = 'Chemistry');

-- ── Students — Class 9A (22 students) ────────────────────────────────────────
SET @c9a = (SELECT id FROM classes WHERE name = '9A');

INSERT INTO students (name, class_id, id_number, student_number, date_of_birth, phone_father, phone_mother, parent_email) VALUES
  ('Noam Cohen',     @c9a, '200101001', 'S001', '2011-03-12', '052-1001001', NULL,         'cohen.family01@gmail.com'),
  ('Tamar Levi',     @c9a, '200101002', 'S002', '2011-07-24', NULL,         '053-1001002', 'levi.family02@gmail.com'),
  ('Yael Goldstein', @c9a, '200101003', 'S003', '2011-01-05', '054-1001003', NULL,         'goldstein03@gmail.com'),
  ('Omer Ben-David', @c9a, '200101004', 'S004', '2011-09-18', '055-1001004', '052-1001404','bendavid04@gmail.com'),
  ('Maya Shapiro',   @c9a, '200101005', 'S005', '2011-04-30', NULL,         '053-1001005', 'shapiro05@gmail.com'),
  ('Daniel Mizrahi', @c9a, '200101006', 'S006', '2011-11-14', '054-1001006', NULL,         'mizrahi06@gmail.com'),
  ('Noa Katz',       @c9a, '200101007', 'S007', '2011-06-22', '052-1001007', '055-1001707','katz.family07@gmail.com'),
  ('Itay Peretz',    @c9a, '200101008', 'S008', '2011-02-08', NULL,         '053-1001008', 'peretz08@gmail.com'),
  ('Shira Amar',     @c9a, '200101009', 'S009', '2011-08-16', '054-1001009', NULL,         'amar.family09@gmail.com'),
  ('Ron Cohen',      @c9a, '200101010', 'S010', '2011-05-03', '055-1001010', '052-1001010','rcohen10@gmail.com'),
  ('Gal Levi',       @c9a, '200101011', 'S011', '2011-10-27', '052-1001011', NULL,         'gallevi11@gmail.com'),
  ('Lior Goldstein', @c9a, '200101012', 'S012', '2011-12-19', NULL,         '053-1001012', 'lior.gold12@gmail.com'),
  ('Tal Shapiro',    @c9a, '200101013', 'S013', '2011-03-07', '054-1001013', NULL,         'talshapiro13@gmail.com'),
  ('Eden Mizrahi',   @c9a, '200101014', 'S014', '2011-07-11', '055-1001014', '052-1001014','eden.miz14@gmail.com'),
  ('Rotem Katz',     @c9a, '200101015', 'S015', '2011-01-25', NULL,         '053-1001015', 'rotemkatz15@gmail.com'),
  ('Ohad Peretz',    @c9a, '200101016', 'S016', '2011-09-09', '054-1001016', NULL,         'ohadp16@gmail.com'),
  ('Shani Amar',     @c9a, '200101017', 'S017', '2011-04-14', '052-1001017', '055-1001017','shaniamar17@gmail.com'),
  ('Eyal Cohen',     @c9a, '200101018', 'S018', '2011-11-28', NULL,         '053-1001018', 'eyalcohen18@gmail.com'),
  ('Dana Levi',      @c9a, '200101019', 'S019', '2011-06-06', '054-1001019', NULL,         'danalevi19@gmail.com'),
  ('Guy Goldstein',  @c9a, '200101020', 'S020', '2011-02-20', '055-1001020', '052-1001020','guygold20@gmail.com'),
  ('Yam Shapiro',    @c9a, '200101021', 'S021', '2011-08-03', NULL,         '053-1001021', 'yamshap21@gmail.com'),
  ('Orr Ben-David',  @c9a, '200101022', 'S022', '2011-12-31', '054-1001022', NULL,         'orr.bd22@gmail.com');

-- ── Students — Class 9B (20 students) ────────────────────────────────────────
SET @c9b = (SELECT id FROM classes WHERE name = '9B');

INSERT INTO students (name, class_id, id_number, student_number, date_of_birth, phone_father, phone_mother, parent_email) VALUES
  ('Aviv Cohen',    @c9b, '200102001', 'S023', '2011-04-17', '052-2001001', NULL,         'avivcohen23@gmail.com'),
  ('Roey Levi',     @c9b, '200102002', 'S024', '2011-08-29', NULL,         '053-2001002', 'roeylevi24@gmail.com'),
  ('Hila Goldstein',@c9b, '200102003', 'S025', '2011-02-13', '054-2001003', NULL,         'hilagold25@gmail.com'),
  ('Idan Ben-David',@c9b, '200102004', 'S026', '2011-10-05', '055-2001004', '052-2001404','idanbd26@gmail.com'),
  ('Sapir Shapiro', @c9b, '200102005', 'S027', '2011-06-21', NULL,         '053-2001005', 'sapirshap27@gmail.com'),
  ('Yuval Mizrahi', @c9b, '200102006', 'S028', '2011-01-09', '054-2001006', NULL,         'yuvalmiz28@gmail.com'),
  ('Keren Katz',    @c9b, '200102007', 'S029', '2011-09-23', '052-2001007', '055-2001707','kerenkatz29@gmail.com'),
  ('Dor Peretz',    @c9b, '200102008', 'S030', '2011-03-15', NULL,         '053-2001008', 'dorperetz30@gmail.com'),
  ('Lihi Amar',     @c9b, '200102009', 'S031', '2011-11-07', '054-2001009', NULL,         'lihiamar31@gmail.com'),
  ('Paz Cohen',     @c9b, '200102010', 'S032', '2011-05-19', '055-2001010', '052-2001010','pazcohen32@gmail.com'),
  ('Sivan Levi',    @c9b, '200102011', 'S033', '2011-07-31', '052-2001011', NULL,         'sivanlevi33@gmail.com'),
  ('Elad Goldstein',@c9b, '200102012', 'S034', '2011-12-03', NULL,         '053-2001012', 'eladgold34@gmail.com'),
  ('Yarin Shapiro', @c9b, '200102013', 'S035', '2011-04-27', '054-2001013', NULL,         'yarinshap35@gmail.com'),
  ('Reut Mizrahi',  @c9b, '200102014', 'S036', '2011-08-11', '055-2001014', '052-2001014','reutmiz36@gmail.com'),
  ('Kfir Katz',     @c9b, '200102015', 'S037', '2011-02-25', NULL,         '053-2001015', 'kfirkatz37@gmail.com'),
  ('Moriya Peretz', @c9b, '200102016', 'S038', '2011-10-17', '054-2001016', NULL,         'moriyap38@gmail.com'),
  ('Bar Amar',      @c9b, '200102017', 'S039', '2011-06-01', '052-2001017', '055-2001017','baramar39@gmail.com'),
  ('Tomer Cohen',   @c9b, '200102018', 'S040', '2011-01-13', NULL,         '053-2001018', 'tomerco40@gmail.com'),
  ('Ofek Levi',     @c9b, '200102019', 'S041', '2011-09-28', '054-2001019', NULL,         'ofeklevi41@gmail.com'),
  ('Inbal Goldstein',@c9b,'200102020', 'S042', '2011-03-06', '055-2001020', '052-2001020','ingold42@gmail.com');

-- ── Students — Class 10A (24 students) ───────────────────────────────────────
SET @c10a = (SELECT id FROM classes WHERE name = '10A');

INSERT INTO students (name, class_id, id_number, student_number, date_of_birth, phone_father, phone_mother, parent_email) VALUES
  ('Neta Cohen',    @c10a, '200103001', 'S043', '2010-05-14', '052-3001001', NULL,         'netaco43@gmail.com'),
  ('Avi Levi',      @c10a, '200103002', 'S044', '2010-09-26', NULL,         '053-3001002', 'avilevi44@gmail.com'),
  ('Michal Goldstein',@c10a,'200103003','S045', '2010-03-08', '054-3001003', NULL,         'michgold45@gmail.com'),
  ('Ran Ben-David', @c10a, '200103004', 'S046', '2010-11-20', '055-3001004', '052-3001404','ranbd46@gmail.com'),
  ('Tehila Shapiro',@c10a, '200103005', 'S047', '2010-07-04', NULL,         '053-3001005', 'tehilash47@gmail.com'),
  ('Oshri Mizrahi', @c10a, '200103006', 'S048', '2010-01-16', '054-3001006', NULL,         'oshrimiz48@gmail.com'),
  ('Coral Katz',    @c10a, '200103007', 'S049', '2010-09-02', '052-3001007', '055-3001707','coralkatz49@gmail.com'),
  ('Ben Peretz',    @c10a, '200103008', 'S050', '2010-04-18', NULL,         '053-3001008', 'benperetz50@gmail.com'),
  ('Efrat Amar',    @c10a, '200103009', 'S051', '2010-10-30', '054-3001009', NULL,         'efratamar51@gmail.com'),
  ('Roi Cohen',     @c10a, '200103010', 'S052', '2010-06-12', '055-3001010', '052-3001010','roicohen52@gmail.com'),
  ('Anat Levi',     @c10a, '200103011', 'S053', '2010-12-24', '052-3001011', NULL,         'anatlevi53@gmail.com'),
  ('Tzvi Goldstein',@c10a, '200103012', 'S054', '2010-08-06', NULL,         '053-3001012', 'tzvigold54@gmail.com'),
  ('Lena Shapiro',  @c10a, '200103013', 'S055', '2010-02-18', '054-3001013', NULL,         'lenashap55@gmail.com'),
  ('Ilan Mizrahi',  @c10a, '200103014', 'S056', '2010-10-01', '055-3001014', '052-3001014','ilanmiz56@gmail.com'),
  ('Bella Katz',    @c10a, '200103015', 'S057', '2010-04-13', NULL,         '053-3001015', 'bellakatz57@gmail.com'),
  ('Ofer Peretz',   @c10a, '200103016', 'S058', '2010-08-25', '054-3001016', NULL,         'oferp58@gmail.com'),
  ('Pnina Amar',    @c10a, '200103017', 'S059', '2010-01-07', '052-3001017', '055-3001017','pninaamar59@gmail.com'),
  ('Dudi Cohen',    @c10a, '200103018', 'S060', '2010-11-19', NULL,         '053-3001018', 'dudicohen60@gmail.com'),
  ('Ziva Levi',     @c10a, '200103019', 'S061', '2010-07-01', '054-3001019', NULL,         'zivalevi61@gmail.com'),
  ('Amos Goldstein',@c10a, '200103020', 'S062', '2010-03-23', '055-3001020', '052-3001020','amosgold62@gmail.com'),
  ('Rina Shapiro',  @c10a, '200103021', 'S063', '2010-09-04', NULL,         '053-3001021', 'rinashap63@gmail.com'),
  ('Eran Mizrahi',  @c10a, '200103022', 'S064', '2010-05-16', '054-3001022', NULL,         'eranmiz64@gmail.com'),
  ('Tali Katz',     @c10a, '200103023', 'S065', '2010-01-28', '052-3001023', '055-3001023','talikatz65@gmail.com'),
  ('Moshe Peretz',  @c10a, '200103024', 'S066', '2010-11-10', NULL,         '053-3001024', 'moshep66@gmail.com');

-- ── Students — Class 10B (21 students) ───────────────────────────────────────
SET @c10b = (SELECT id FROM classes WHERE name = '10B');

INSERT INTO students (name, class_id, id_number, student_number, date_of_birth, phone_father, phone_mother, parent_email) VALUES
  ('Hadas Cohen',   @c10b, '200104001', 'S067', '2010-06-09', '052-4001001', NULL,         'hadasc67@gmail.com'),
  ('Benny Levi',    @c10b, '200104002', 'S068', '2010-10-21', NULL,         '053-4001002', 'bennylevi68@gmail.com'),
  ('Sigal Goldstein',@c10b,'200104003', 'S069', '2010-02-03', '054-4001003', NULL,         'sigalgold69@gmail.com'),
  ('Doron Ben-David',@c10b,'200104004', 'S070', '2010-08-15', '055-4001004', '052-4001404','doronbd70@gmail.com'),
  ('Meirav Shapiro',@c10b, '200104005', 'S071', '2010-04-27', NULL,         '053-4001005', 'meiravsh71@gmail.com'),
  ('Amir Mizrahi',  @c10b, '200104006', 'S072', '2010-12-09', '054-4001006', NULL,         'amirmiz72@gmail.com'),
  ('Iris Katz',     @c10b, '200104007', 'S073', '2010-06-21', '052-4001007', '055-4001707','iriskatz73@gmail.com'),
  ('Nadav Peretz',  @c10b, '200104008', 'S074', '2010-01-05', NULL,         '053-4001008', 'nadavp74@gmail.com'),
  ('Yifat Amar',    @c10b, '200104009', 'S075', '2010-09-17', '054-4001009', NULL,         'yifatamar75@gmail.com'),
  ('Shlomi Cohen',  @c10b, '200104010', 'S076', '2010-03-31', '055-4001010', '052-4001010','shlomicohen76@gmail.com'),
  ('Gili Levi',     @c10b, '200104011', 'S077', '2010-07-13', '052-4001011', NULL,         'gililevi77@gmail.com'),
  ('Eytan Goldstein',@c10b,'200104012', 'S078', '2010-11-25', NULL,         '053-4001012', 'eytangold78@gmail.com'),
  ('Rona Shapiro',  @c10b, '200104013', 'S079', '2010-05-07', '054-4001013', NULL,         'ronashap79@gmail.com'),
  ('Yaniv Mizrahi', @c10b, '200104014', 'S080', '2010-01-19', '055-4001014', '052-4001014','yanivmiz80@gmail.com'),
  ('Esti Katz',     @c10b, '200104015', 'S081', '2010-09-01', NULL,         '053-4001015', 'estikatz81@gmail.com'),
  ('Boaz Peretz',   @c10b, '200104016', 'S082', '2010-03-14', '054-4001016', NULL,         'boazp82@gmail.com'),
  ('Ayelet Amar',   @c10b, '200104017', 'S083', '2010-07-26', '052-4001017', '055-4001017','ayeletamar83@gmail.com'),
  ('Liat Cohen',    @c10b, '200104018', 'S084', '2010-11-08', NULL,         '053-4001018', 'liatcohen84@gmail.com'),
  ('Assaf Levi',    @c10b, '200104019', 'S085', '2010-05-20', '054-4001019', NULL,         'assaflevi85@gmail.com'),
  ('Chana Goldstein',@c10b,'200104020', 'S086', '2010-02-01', '055-4001020', '052-4001020','chanagold86@gmail.com'),
  ('Mor Shapiro',   @c10b, '200104021', 'S087', '2010-10-13', NULL,         '053-4001021', 'morshap87@gmail.com');

-- ── Grades (generated via JOIN — no manual row-by-row inserts) ───────────────
-- Each student gets grades for every subject taught in their class,
-- for exam types: quiz, test, midterm, final (numeric, 0-100 scale)

INSERT INTO grades (student_id, subject_id, teacher_id, exam_type_id, grade, max_grade, date)
SELECT
  s.id                                        AS student_id,
  ts.subject_id                               AS subject_id,
  tc.teacher_id                               AS teacher_id,
  et.id                                       AS exam_type_id,
  ROUND(62 + (RAND() * 38), 0)               AS grade,   -- 62–100
  100                                         AS max_grade,
  DATE_SUB('2026-01-20', INTERVAL FLOOR(RAND() * 120) DAY) AS date
FROM students s
JOIN teacher_classes  tc  ON tc.class_id    = s.class_id
JOIN teacher_subjects ts  ON ts.teacher_id  = tc.teacher_id
JOIN exam_types       et  ON et.code IN ('quiz', 'test', 'midterm', 'final')
WHERE s.is_active = 1;

-- Homework grades (pass = 1 / fail = 0, max_grade = 1)
INSERT INTO grades (student_id, subject_id, teacher_id, exam_type_id, grade, max_grade, date)
SELECT
  s.id,
  ts.subject_id,
  tc.teacher_id,
  (SELECT id FROM exam_types WHERE code = 'homework'),
  IF(RAND() > 0.08, 1, 0),   -- ~92% pass rate
  1,
  DATE_SUB('2026-01-25', INTERVAL FLOOR(RAND() * 60) DAY)
FROM students s
JOIN teacher_classes  tc  ON tc.class_id   = s.class_id
JOIN teacher_subjects ts  ON ts.teacher_id = tc.teacher_id
WHERE s.is_active = 1;

-- ── Final: make sure student_count in classes matches reality ─────────────────
UPDATE classes SET student_count = (
  SELECT COUNT(*) FROM students WHERE students.class_id = classes.id AND students.is_active = 1
);

SELECT CONCAT('Seed complete — ', COUNT(*), ' grades generated.') AS result FROM grades;
