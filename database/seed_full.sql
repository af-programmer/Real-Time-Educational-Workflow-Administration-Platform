-- -- ============================================================
-- -- EduFlow Full Seed Data  (v2 — with Educator role)
-- -- Password for ALL users: Password123!
-- -- bcrypt hash ($2a$12$...): $2a$12$y8htSJCWQSWLXzd28DD1X.O7d68CWxGDPzbqr2WVviba8.lAa7coO
-- -- Run: mysql -u root -p eduflow < database/seed_full.sql
-- -- WARNING: wipes all existing data first.
-- -- ============================================================
-- USE eduflow;

-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE grades;
-- TRUNCATE TABLE print_request_classes;
-- TRUNCATE TABLE print_files;
-- TRUNCATE TABLE print_requests;
-- TRUNCATE TABLE message_reads;
-- TRUNCATE TABLE message_deletes;
-- TRUNCATE TABLE messages;
-- TRUNCATE TABLE notification_reads;
-- TRUNCATE TABLE notifications;
-- TRUNCATE TABLE teacher_homeroom_classes;
-- TRUNCATE TABLE teacher_classes;
-- TRUNCATE TABLE teacher_subjects;
-- TRUNCATE TABLE teacher_library;
-- TRUNCATE TABLE students;
-- TRUNCATE TABLE user_credentials;
-- TRUNCATE TABLE users;
-- TRUNCATE TABLE classes;
-- TRUNCATE TABLE subjects;
-- TRUNCATE TABLE exam_types;
-- TRUNCATE TABLE print_statuses;
-- TRUNCATE TABLE print_priorities;
-- TRUNCATE TABLE grade_levels;
-- TRUNCATE TABLE quotes;
-- TRUNCATE TABLE roles;
-- SET FOREIGN_KEY_CHECKS = 1;

-- -- ── Roles ─────────────────────────────────────────────────────────────────────
-- INSERT INTO roles (name) VALUES
--   ('admin'), ('secretary'), ('teacher'), ('Educator');

-- -- ── Grade levels ──────────────────────────────────────────────────────────────
-- INSERT INTO grade_levels (code, label) VALUES
--   ('9',  '9th Grade'),
--   ('10', '10th Grade'),
--   ('11', '11th Grade'),
--   ('12', '12th Grade');

-- -- ── Print priorities ──────────────────────────────────────────────────────────
-- INSERT INTO print_priorities (code, label, sort_order) VALUES
--   ('urgent',    'Urgent',    1),
--   ('important', 'Important', 2),
--   ('normal',    'Normal',    3);

-- -- ── Print statuses ────────────────────────────────────────────────────────────
-- INSERT INTO print_statuses (code, label, sort_order) VALUES
--   ('pending',     'Pending',     1),
--   ('in_progress', 'In Progress', 2),
--   ('printed',     'Printed',     3),
--   ('completed',   'Completed',   4);

-- -- ── Exam types ────────────────────────────────────────────────────────────────
-- INSERT INTO exam_types (code, label) VALUES
--   ('quiz',     'Quiz'),
--   ('test',     'Test'),
--   ('midterm',  'Midterm Exam'),
--   ('final',    'Final Exam'),
--   ('homework', 'Homework');

-- -- ── Quotes ────────────────────────────────────────────────────────────────────
-- INSERT INTO quotes (role, text) VALUES
--   ('admin', 'Leadership is not about rank or title — it is about influence, impact, and the inspiration you spark in others.'),
--   ('admin', 'Education is not the filling of a vessel, but the kindling of a flame.'),
--   ('admin', 'A great principal builds people, not just systems.'),
--   ('admin', 'Vision without action is merely a dream. Vision combined with action can change reality.'),
--   ('admin', 'Organizational culture is rebuilt every day through respect, listening, and personal example.'),
--   ('admin', 'A principal''s role is not to prevent storms, but to teach the team to sail together even when the sea is rough.'),
--   ('admin', 'The best way to predict the future of your school is to build it together with your team.'),
--   ('admin', 'A leader''s success is measured by the number of people they grow, not the number who work under them.'),
--   ('teacher', 'Every child needs at least one adult who believes in them unconditionally.'),
--   ('teacher', 'A mediocre teacher tells. A good teacher explains. An exceptional teacher inspires.'),
--   ('teacher', 'The influence of a great teacher echoes forever — you can never know where it ends.'),
--   ('teacher', 'Teaching is not my profession — teaching is my purpose.'),
--   ('teacher', 'The words you say to a student today become the inner voice they carry tomorrow.'),
--   ('teacher', 'Patience is the root of all pedagogical success; the seeds you plant today may bloom years from now.'),
--   ('teacher', 'Never give up on a student — you never know what success story they are about to write.'),
--   ('teacher', 'Meaningful teaching begins the moment a student feels truly seen.'),
--   ('teacher', 'Education is the means by which we help a person become everything they are capable of being.'),
--   ('secretary', 'A smile and a kind word are the keys that open every door in a school.'),
--   ('secretary', 'Order and organisation are the foundation on which great educational work grows.'),
--   ('secretary', 'Courtesy in service is not just a duty — it is the way we make the workplace better for everyone.'),
--   ('secretary', 'The small details are the ones that create the big, successful picture.'),
--   ('secretary', 'A strong office team is the backbone that keeps the entire educational system standing tall.'),
--   ('secretary', 'Behind every successful school stands an office team that handles the small details with professionalism.'),
--   ('secretary', 'The way you answer the phone is the showcase of the entire institution.'),
--   ('secretary', 'Where there is order, there is room to grow.');

-- -- ── Subjects (8) ──────────────────────────────────────────────────────────────
-- INSERT INTO subjects (name, description) VALUES
--   ('Mathematics',  'Algebra, Geometry, Calculus'),
--   ('Physics',      'Mechanics, Electricity, Optics'),
--   ('English',      'Literature, Grammar, Writing'),
--   ('Literature',   'Hebrew Classical and Modern Texts'),
--   ('History',      'World and Israeli History'),
--   ('Geography',    'Physical and Human Geography'),
--   ('Biology',      'Cell Biology, Genetics, Ecology'),
--   ('Chemistry',    'Organic and Inorganic Chemistry');

-- -- ── Classes (4) ───────────────────────────────────────────────────────────────
-- INSERT INTO classes (name, student_count, grade_level_id, academic_year) VALUES
--   ('9A',  22, (SELECT id FROM grade_levels WHERE code = '9'),  '2025-2026'),
--   ('9B',  20, (SELECT id FROM grade_levels WHERE code = '9'),  '2025-2026'),
--   ('10A', 24, (SELECT id FROM grade_levels WHERE code = '10'), '2025-2026'),
--   ('10B', 21, (SELECT id FROM grade_levels WHERE code = '10'), '2025-2026');

-- -- ── Users (11 total) ──────────────────────────────────────────────────────────
-- -- 1 admin, 2 secretaries, 4 Educators, 4 professional teachers
-- -- All passwords: Password123!

-- INSERT INTO users (name, email, role_id, phone, phone2) VALUES
--   -- Admin
--   ('Roni Avraham',   'admin@gmail.com',   (SELECT id FROM roles WHERE name = 'admin'),           '03-6543210', NULL),
--   -- Secretaries
--   ('Dana Cohen',     'dana@gmail.com',    (SELECT id FROM roles WHERE name = 'secretary'),        '052-1234567', NULL),
--   ('Noa Levi',       'noa@gmail.com',     (SELECT id FROM roles WHERE name = 'secretary'),        '053-2345678', NULL),
--   -- Educators
--   ('Yael Shapiro',   'yael@gmail.com',    (SELECT id FROM roles WHERE name = 'Educator'), '054-3456789', '050-1111111'),
--   ('Avi Goldstein',  'avi@gmail.com',     (SELECT id FROM roles WHERE name = 'Educator'), '055-4567890', NULL),
--   ('Miriam Katz',    'miriam@gmail.com',  (SELECT id FROM roles WHERE name = 'Educator'), '054-5678901', '052-9876543'),
--   ('David Ben-David','david@gmail.com',   (SELECT id FROM roles WHERE name = 'Educator'), '053-6789012', NULL),
--   -- Professional teachers
--   ('Rachel Mizrahi', 'rachel@gmail.com',  (SELECT id FROM roles WHERE name = 'teacher'),          '052-7890123', NULL),
--   ('Shlomo Peretz',  'shlomo@gmail.com',  (SELECT id FROM roles WHERE name = 'teacher'),          '054-8901234', NULL),
--   ('Tamar Amar',     'tamar@gmail.com',   (SELECT id FROM roles WHERE name = 'teacher'),          '055-9012345', '050-2222222'),
--   ('Eli Cohen',      'eli@gmail.com',     (SELECT id FROM roles WHERE name = 'teacher'),          '052-0123456', NULL);

-- -- ── Credentials (same hash for all) ──────────────────────────────────────────
-- INSERT INTO user_credentials (user_id, password_hash)
-- SELECT id, '$2a$12$y8htSJCWQSWLXzd28DD1X.O7d68CWxGDPzbqr2WVviba8.lAa7coO'
-- FROM users;

-- -- ── Homeroom class assignments ────────────────────────────────────────────────
-- INSERT INTO teacher_homeroom_classes (teacher_id, class_id)
-- SELECT u.id, c.id FROM users u, classes c
-- WHERE (u.email = 'yael@gmail.com'  AND c.name = '9A')
--    OR (u.email = 'avi@gmail.com'   AND c.name = '9B')
--    OR (u.email = 'miriam@gmail.com' AND c.name = '10A')
--    OR (u.email = 'david@gmail.com' AND c.name = '10B');

-- -- ── Teaching class assignments ────────────────────────────────────────────────
-- -- Educators also teach in multiple classes:
-- -- Yael: Math in 9A + 9B
-- INSERT INTO teacher_classes (teacher_id, class_id)
-- SELECT u.id, c.id FROM users u, classes c
-- WHERE u.email = 'yael@gmail.com' AND c.name IN ('9A','9B');

-- -- Avi: English in 9A + 9B
-- INSERT INTO teacher_classes (teacher_id, class_id)
-- SELECT u.id, c.id FROM users u, classes c
-- WHERE u.email = 'avi@gmail.com' AND c.name IN ('9A','9B');

-- -- Miriam: History in 10A + 10B
-- INSERT INTO teacher_classes (teacher_id, class_id)
-- SELECT u.id, c.id FROM users u, classes c
-- WHERE u.email = 'miriam@gmail.com' AND c.name IN ('10A','10B');

-- -- David: Literature in 10A + 10B
-- INSERT INTO teacher_classes (teacher_id, class_id)
-- SELECT u.id, c.id FROM users u, classes c
-- WHERE u.email = 'david@gmail.com' AND c.name IN ('10A','10B');

-- -- Professional teachers — all 4 classes:
-- -- Rachel: Physics in all
-- INSERT INTO teacher_classes (teacher_id, class_id)
-- SELECT u.id, c.id FROM users u, classes c
-- WHERE u.email = 'rachel@gmail.com';

-- -- Shlomo: Geography in all
-- INSERT INTO teacher_classes (teacher_id, class_id)
-- SELECT u.id, c.id FROM users u, classes c
-- WHERE u.email = 'shlomo@gmail.com';

-- -- Tamar: Biology in 9A + 9B only
-- INSERT INTO teacher_classes (teacher_id, class_id)
-- SELECT u.id, c.id FROM users u, classes c
-- WHERE u.email = 'tamar@gmail.com' AND c.name IN ('9A','9B');

-- -- Eli: Chemistry in 10A + 10B only
-- INSERT INTO teacher_classes (teacher_id, class_id)
-- SELECT u.id, c.id FROM users u, classes c
-- WHERE u.email = 'eli@gmail.com' AND c.name IN ('10A','10B');

-- -- ── Subject assignments ───────────────────────────────────────────────────────
-- INSERT INTO teacher_subjects (teacher_id, subject_id)
-- SELECT u.id, s.id FROM users u, subjects s
-- WHERE (u.email = 'yael@gmail.com'   AND s.name = 'Mathematics')
--    OR (u.email = 'avi@gmail.com'    AND s.name = 'English')
--    OR (u.email = 'miriam@gmail.com' AND s.name = 'History')
--    OR (u.email = 'david@gmail.com'  AND s.name = 'Literature')
--    OR (u.email = 'rachel@gmail.com' AND s.name = 'Physics')
--    OR (u.email = 'shlomo@gmail.com' AND s.name = 'Geography')
--    OR (u.email = 'tamar@gmail.com'  AND s.name = 'Biology')
--    OR (u.email = 'eli@gmail.com'    AND s.name = 'Chemistry');

-- -- ── Students — Class 9A (22 students) ────────────────────────────────────────
-- SET @c9a = (SELECT id FROM classes WHERE name = '9A');

-- INSERT INTO students (name, class_id, id_number, student_number, date_of_birth, phone_father, phone_mother, parent_email) VALUES
--   ('Noam Cohen',     @c9a, '200101001', 'S001', '2011-03-12', '052-1001001', NULL,         'cohen.family01@gmail.com'),
--   ('Tamar Levi',     @c9a, '200101002', 'S002', '2011-07-24', NULL,         '053-1001002', 'levi.family02@gmail.com'),
--   ('Yael Goldstein', @c9a, '200101003', 'S003', '2011-01-05', '054-1001003', NULL,         'goldstein03@gmail.com'),
--   ('Omer Ben-David', @c9a, '200101004', 'S004', '2011-09-18', '055-1001004', '052-1001404','bendavid04@gmail.com'),
--   ('Maya Shapiro',   @c9a, '200101005', 'S005', '2011-04-30', NULL,         '053-1001005', 'shapiro05@gmail.com'),
--   ('Daniel Mizrahi', @c9a, '200101006', 'S006', '2011-11-14', '054-1001006', NULL,         'mizrahi06@gmail.com'),
--   ('Noa Katz',       @c9a, '200101007', 'S007', '2011-06-22', '052-1001007', '055-1001707','katz.family07@gmail.com'),
--   ('Itay Peretz',    @c9a, '200101008', 'S008', '2011-02-08', NULL,         '053-1001008', 'peretz08@gmail.com'),
--   ('Shira Amar',     @c9a, '200101009', 'S009', '2011-08-16', '054-1001009', NULL,         'amar.family09@gmail.com'),
--   ('Ron Cohen',      @c9a, '200101010', 'S010', '2011-05-03', '055-1001010', '052-1001010','rcohen10@gmail.com'),
--   ('Gal Levi',       @c9a, '200101011', 'S011', '2011-10-27', '052-1001011', NULL,         'gallevi11@gmail.com'),
--   ('Lior Goldstein', @c9a, '200101012', 'S012', '2011-12-19', NULL,         '053-1001012', 'lior.gold12@gmail.com'),
--   ('Tal Shapiro',    @c9a, '200101013', 'S013', '2011-03-07', '054-1001013', NULL,         'talshapiro13@gmail.com'),
--   ('Eden Mizrahi',   @c9a, '200101014', 'S014', '2011-07-11', '055-1001014', '052-1001014','eden.miz14@gmail.com'),
--   ('Rotem Katz',     @c9a, '200101015', 'S015', '2011-01-25', NULL,         '053-1001015', 'rotemkatz15@gmail.com'),
--   ('Ohad Peretz',    @c9a, '200101016', 'S016', '2011-09-09', '054-1001016', NULL,         'ohadp16@gmail.com'),
--   ('Shani Amar',     @c9a, '200101017', 'S017', '2011-04-14', '052-1001017', '055-1001017','shaniamar17@gmail.com'),
--   ('Eyal Cohen',     @c9a, '200101018', 'S018', '2011-11-28', NULL,         '053-1001018', 'eyalcohen18@gmail.com'),
--   ('Dana Levi',      @c9a, '200101019', 'S019', '2011-06-06', '054-1001019', NULL,         'danalevi19@gmail.com'),
--   ('Guy Goldstein',  @c9a, '200101020', 'S020', '2011-02-20', '055-1001020', '052-1001020','guygold20@gmail.com'),
--   ('Yam Shapiro',    @c9a, '200101021', 'S021', '2011-08-03', NULL,         '053-1001021', 'yamshap21@gmail.com'),
--   ('Orr Ben-David',  @c9a, '200101022', 'S022', '2011-12-31', '054-1001022', NULL,         'orr.bd22@gmail.com');

-- -- ── Students — Class 9B (20 students) ────────────────────────────────────────
-- SET @c9b = (SELECT id FROM classes WHERE name = '9B');

-- INSERT INTO students (name, class_id, id_number, student_number, date_of_birth, phone_father, phone_mother, parent_email) VALUES
--   ('Aviv Cohen',    @c9b, '200102001', 'S023', '2011-04-17', '052-2001001', NULL,         'avivcohen23@gmail.com'),
--   ('Roey Levi',     @c9b, '200102002', 'S024', '2011-08-29', NULL,         '053-2001002', 'roeylevi24@gmail.com'),
--   ('Hila Goldstein',@c9b, '200102003', 'S025', '2011-02-13', '054-2001003', NULL,         'hilagold25@gmail.com'),
--   ('Idan Ben-David',@c9b, '200102004', 'S026', '2011-10-05', '055-2001004', '052-2001404','idanbd26@gmail.com'),
--   ('Sapir Shapiro', @c9b, '200102005', 'S027', '2011-06-21', NULL,         '053-2001005', 'sapirshap27@gmail.com'),
--   ('Yuval Mizrahi', @c9b, '200102006', 'S028', '2011-01-09', '054-2001006', NULL,         'yuvalmiz28@gmail.com'),
--   ('Keren Katz',    @c9b, '200102007', 'S029', '2011-09-23', '052-2001007', '055-2001707','kerenkatz29@gmail.com'),
--   ('Dor Peretz',    @c9b, '200102008', 'S030', '2011-03-15', NULL,         '053-2001008', 'dorperetz30@gmail.com'),
--   ('Lihi Amar',     @c9b, '200102009', 'S031', '2011-11-07', '054-2001009', NULL,         'lihiamar31@gmail.com'),
--   ('Paz Cohen',     @c9b, '200102010', 'S032', '2011-05-19', '055-2001010', '052-2001010','pazcohen32@gmail.com'),
--   ('Sivan Levi',    @c9b, '200102011', 'S033', '2011-07-31', '052-2001011', NULL,         'sivanlevi33@gmail.com'),
--   ('Elad Goldstein',@c9b, '200102012', 'S034', '2011-12-03', NULL,         '053-2001012', 'eladgold34@gmail.com'),
--   ('Yarin Shapiro', @c9b, '200102013', 'S035', '2011-04-27', '054-2001013', NULL,         'yarinshap35@gmail.com'),
--   ('Reut Mizrahi',  @c9b, '200102014', 'S036', '2011-08-11', '055-2001014', '052-2001014','reutmiz36@gmail.com'),
--   ('Kfir Katz',     @c9b, '200102015', 'S037', '2011-02-25', NULL,         '053-2001015', 'kfirkatz37@gmail.com'),
--   ('Moriya Peretz', @c9b, '200102016', 'S038', '2011-10-17', '054-2001016', NULL,         'moriyap38@gmail.com'),
--   ('Bar Amar',      @c9b, '200102017', 'S039', '2011-06-01', '052-2001017', '055-2001017','baramar39@gmail.com'),
--   ('Tomer Cohen',   @c9b, '200102018', 'S040', '2011-01-13', NULL,         '053-2001018', 'tomerco40@gmail.com'),
--   ('Ofek Levi',     @c9b, '200102019', 'S041', '2011-09-28', '054-2001019', NULL,         'ofeklevi41@gmail.com'),
--   ('Inbal Goldstein',@c9b,'200102020', 'S042', '2011-03-06', '055-2001020', '052-2001020','ingold42@gmail.com');

-- -- ── Students — Class 10A (24 students) ───────────────────────────────────────
-- SET @c10a = (SELECT id FROM classes WHERE name = '10A');

-- INSERT INTO students (name, class_id, id_number, student_number, date_of_birth, phone_father, phone_mother, parent_email) VALUES
--   ('Neta Cohen',    @c10a, '200103001', 'S043', '2010-05-14', '052-3001001', NULL,         'netaco43@gmail.com'),
--   ('Avi Levi',      @c10a, '200103002', 'S044', '2010-09-26', NULL,         '053-3001002', 'avilevi44@gmail.com'),
--   ('Michal Goldstein',@c10a,'200103003','S045', '2010-03-08', '054-3001003', NULL,         'michgold45@gmail.com'),
--   ('Ran Ben-David', @c10a, '200103004', 'S046', '2010-11-20', '055-3001004', '052-3001404','ranbd46@gmail.com'),
--   ('Tehila Shapiro',@c10a, '200103005', 'S047', '2010-07-04', NULL,         '053-3001005', 'tehilash47@gmail.com'),
--   ('Oshri Mizrahi', @c10a, '200103006', 'S048', '2010-01-16', '054-3001006', NULL,         'oshrimiz48@gmail.com'),
--   ('Coral Katz',    @c10a, '200103007', 'S049', '2010-09-02', '052-3001007', '055-3001707','coralkatz49@gmail.com'),
--   ('Ben Peretz',    @c10a, '200103008', 'S050', '2010-04-18', NULL,         '053-3001008', 'benperetz50@gmail.com'),
--   ('Efrat Amar',    @c10a, '200103009', 'S051', '2010-10-30', '054-3001009', NULL,         'efratamar51@gmail.com'),
--   ('Roi Cohen',     @c10a, '200103010', 'S052', '2010-06-12', '055-3001010', '052-3001010','roicohen52@gmail.com'),
--   ('Anat Levi',     @c10a, '200103011', 'S053', '2010-12-24', '052-3001011', NULL,         'anatlevi53@gmail.com'),
--   ('Tzvi Goldstein',@c10a, '200103012', 'S054', '2010-08-06', NULL,         '053-3001012', 'tzvigold54@gmail.com'),
--   ('Lena Shapiro',  @c10a, '200103013', 'S055', '2010-02-18', '054-3001013', NULL,         'lenashap55@gmail.com'),
--   ('Ilan Mizrahi',  @c10a, '200103014', 'S056', '2010-10-01', '055-3001014', '052-3001014','ilanmiz56@gmail.com'),
--   ('Bella Katz',    @c10a, '200103015', 'S057', '2010-04-13', NULL,         '053-3001015', 'bellakatz57@gmail.com'),
--   ('Ofer Peretz',   @c10a, '200103016', 'S058', '2010-08-25', '054-3001016', NULL,         'oferp58@gmail.com'),
--   ('Pnina Amar',    @c10a, '200103017', 'S059', '2010-01-07', '052-3001017', '055-3001017','pninaamar59@gmail.com'),
--   ('Dudi Cohen',    @c10a, '200103018', 'S060', '2010-11-19', NULL,         '053-3001018', 'dudicohen60@gmail.com'),
--   ('Ziva Levi',     @c10a, '200103019', 'S061', '2010-07-01', '054-3001019', NULL,         'zivalevi61@gmail.com'),
--   ('Amos Goldstein',@c10a, '200103020', 'S062', '2010-03-23', '055-3001020', '052-3001020','amosgold62@gmail.com'),
--   ('Rina Shapiro',  @c10a, '200103021', 'S063', '2010-09-04', NULL,         '053-3001021', 'rinashap63@gmail.com'),
--   ('Eran Mizrahi',  @c10a, '200103022', 'S064', '2010-05-16', '054-3001022', NULL,         'eranmiz64@gmail.com'),
--   ('Tali Katz',     @c10a, '200103023', 'S065', '2010-01-28', '052-3001023', '055-3001023','talikatz65@gmail.com'),
--   ('Moshe Peretz',  @c10a, '200103024', 'S066', '2010-11-10', NULL,         '053-3001024', 'moshep66@gmail.com');

-- -- ── Students — Class 10B (21 students) ───────────────────────────────────────
-- SET @c10b = (SELECT id FROM classes WHERE name = '10B');

-- INSERT INTO students (name, class_id, id_number, student_number, date_of_birth, phone_father, phone_mother, parent_email) VALUES
--   ('Hadas Cohen',   @c10b, '200104001', 'S067', '2010-06-09', '052-4001001', NULL,         'hadasc67@gmail.com'),
--   ('Benny Levi',    @c10b, '200104002', 'S068', '2010-10-21', NULL,         '053-4001002', 'bennylevi68@gmail.com'),
--   ('Sigal Goldstein',@c10b,'200104003', 'S069', '2010-02-03', '054-4001003', NULL,         'sigalgold69@gmail.com'),
--   ('Doron Ben-David',@c10b,'200104004', 'S070', '2010-08-15', '055-4001004', '052-4001404','doronbd70@gmail.com'),
--   ('Meirav Shapiro',@c10b, '200104005', 'S071', '2010-04-27', NULL,         '053-4001005', 'meiravsh71@gmail.com'),
--   ('Amir Mizrahi',  @c10b, '200104006', 'S072', '2010-12-09', '054-4001006', NULL,         'amirmiz72@gmail.com'),
--   ('Iris Katz',     @c10b, '200104007', 'S073', '2010-06-21', '052-4001007', '055-4001707','iriskatz73@gmail.com'),
--   ('Nadav Peretz',  @c10b, '200104008', 'S074', '2010-01-05', NULL,         '053-4001008', 'nadavp74@gmail.com'),
--   ('Yifat Amar',    @c10b, '200104009', 'S075', '2010-09-17', '054-4001009', NULL,         'yifatamar75@gmail.com'),
--   ('Shlomi Cohen',  @c10b, '200104010', 'S076', '2010-03-31', '055-4001010', '052-4001010','shlomicohen76@gmail.com'),
--   ('Gili Levi',     @c10b, '200104011', 'S077', '2010-07-13', '052-4001011', NULL,         'gililevi77@gmail.com'),
--   ('Eytan Goldstein',@c10b,'200104012', 'S078', '2010-11-25', NULL,         '053-4001012', 'eytangold78@gmail.com'),
--   ('Rona Shapiro',  @c10b, '200104013', 'S079', '2010-05-07', '054-4001013', NULL,         'ronashap79@gmail.com'),
--   ('Yaniv Mizrahi', @c10b, '200104014', 'S080', '2010-01-19', '055-4001014', '052-4001014','yanivmiz80@gmail.com'),
--   ('Esti Katz',     @c10b, '200104015', 'S081', '2010-09-01', NULL,         '053-4001015', 'estikatz81@gmail.com'),
--   ('Boaz Peretz',   @c10b, '200104016', 'S082', '2010-03-14', '054-4001016', NULL,         'boazp82@gmail.com'),
--   ('Ayelet Amar',   @c10b, '200104017', 'S083', '2010-07-26', '052-4001017', '055-4001017','ayeletamar83@gmail.com'),
--   ('Liat Cohen',    @c10b, '200104018', 'S084', '2010-11-08', NULL,         '053-4001018', 'liatcohen84@gmail.com'),
--   ('Assaf Levi',    @c10b, '200104019', 'S085', '2010-05-20', '054-4001019', NULL,         'assaflevi85@gmail.com'),
--   ('Chana Goldstein',@c10b,'200104020', 'S086', '2010-02-01', '055-4001020', '052-4001020','chanagold86@gmail.com'),
--   ('Mor Shapiro',   @c10b, '200104021', 'S087', '2010-10-13', NULL,         '053-4001021', 'morshap87@gmail.com');

-- -- ── Grades (generated via JOIN — no manual row-by-row inserts) ───────────────
-- -- Each student gets grades for every subject taught in their class,
-- -- for exam types: quiz, test, midterm, final (numeric, 0-100 scale)

-- INSERT INTO grades (student_id, subject_id, teacher_id, exam_type_id, grade, max_grade, date)
-- SELECT
--   s.id                                        AS student_id,
--   ts.subject_id                               AS subject_id,
--   tc.teacher_id                               AS teacher_id,
--   et.id                                       AS exam_type_id,
--   ROUND(62 + (RAND() * 38), 0)               AS grade,   -- 62–100
--   100                                         AS max_grade,
--   DATE_SUB('2026-01-20', INTERVAL FLOOR(RAND() * 120) DAY) AS date
-- FROM students s
-- JOIN teacher_classes  tc  ON tc.class_id    = s.class_id
-- JOIN teacher_subjects ts  ON ts.teacher_id  = tc.teacher_id
-- JOIN exam_types       et  ON et.code IN ('quiz', 'test', 'midterm', 'final')
-- WHERE s.is_active = 1;

-- -- Homework grades (pass = 1 / fail = 0, max_grade = 1)
-- INSERT INTO grades (student_id, subject_id, teacher_id, exam_type_id, grade, max_grade, date)
-- SELECT
--   s.id,
--   ts.subject_id,
--   tc.teacher_id,
--   (SELECT id FROM exam_types WHERE code = 'homework'),
--   IF(RAND() > 0.08, 1, 0),   -- ~92% pass rate
--   1,
--   DATE_SUB('2026-01-25', INTERVAL FLOOR(RAND() * 60) DAY)
-- FROM students s
-- JOIN teacher_classes  tc  ON tc.class_id   = s.class_id
-- JOIN teacher_subjects ts  ON ts.teacher_id = tc.teacher_id
-- WHERE s.is_active = 1;

-- -- ── Final: make sure student_count in classes matches reality ─────────────────
-- UPDATE classes SET student_count = (
--   SELECT COUNT(*) FROM students WHERE students.class_id = classes.id AND students.is_active = 1
-- );

-- SELECT CONCAT('Seed complete — ', COUNT(*), ' grades generated.') AS result FROM grades;




-- ============================================================
-- EduFlow Full Seed Data
-- Password for ALL users:  
-- Run: mysql -u root -p eduflow < database/seed_full.sql
-- WARNING: replaces all existing data.
-- ============================================================
USE eduflow;

-- ── Clear ALL tables ──────────────────────────────────────────
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE grade_comments;
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
TRUNCATE TABLE audit_logs;
TRUNCATE TABLE exam_types;
TRUNCATE TABLE print_statuses;
TRUNCATE TABLE print_priorities;
TRUNCATE TABLE grade_levels;
TRUNCATE TABLE roles;
TRUNCATE TABLE quotes;
SET FOREIGN_KEY_CHECKS = 1;

-- ── Lookup tables ─────────────────────────────────────────────
INSERT INTO roles (name) VALUES ('admin'), ('secretary'), ('teacher');

INSERT INTO grade_levels (code, label) VALUES
  ('9','9th Grade'), ('10','10th Grade'),
  ('11','11th Grade'), ('12','12th Grade');

INSERT INTO print_priorities (code, label, sort_order) VALUES
  ('normal','Normal',3), ('important','Important',2), ('urgent','Urgent',1);

INSERT INTO print_statuses (code, label, sort_order) VALUES
  ('pending','Pending',1), ('in_progress','In Progress',2),
  ('printed','Printed',3), ('completed','Completed',4);

INSERT INTO exam_types (code, label) VALUES
  ('quiz','Quiz'), ('test','Test'),
  ('midterm','Midterm Exam'), ('final','Final Exam'), ('homework','Homework');

-- ── Quotes ────────────────────────────────────────────────────
INSERT INTO quotes (role, text) VALUES
  ('admin','Leadership is not about rank or title — it is about influence, impact, and the inspiration you spark in others.'),
  ('admin','Education is not the filling of a vessel, but the kindling of a flame.'),
  ('admin','A great principal builds people, not just systems.'),
  ('admin','Vision without action is merely a dream. Vision combined with action can change reality.'),
  ('admin','Organizational culture is rebuilt every day through respect, listening, and personal example.'),
  ('teacher','Every child needs at least one adult who believes in them unconditionally.'),
  ('teacher','A mediocre teacher tells. A good teacher explains. An exceptional teacher inspires.'),
  ('teacher','The influence of a great teacher echoes forever — you can never know where it ends.'),
  ('teacher','Teaching is not my profession — teaching is my purpose.'),
  ('teacher','The words you say to a student today become the inner voice they carry tomorrow.'),
  ('teacher','Patience is the root of all pedagogical success; the seeds you plant today may bloom years from now.'),
  ('secretary','A smile and a kind word are the keys that open every door in a school.'),
  ('secretary','Order and organisation are the foundation on which great educational work grows.'),
  ('secretary','The small details are the ones that create the big, successful picture.'),
  ('secretary','Where there is order, there is room to grow.');

-- ── Subjects (12) ─────────────────────────────────────────────
INSERT INTO subjects (name, description) VALUES
  ('Mathematics',       'Algebra, Geometry, Calculus'),
  ('English',           'Literature, Grammar, Writing'),
  ('Hebrew Literature', 'Classical and Modern Hebrew Texts'),
  ('History',           'World and Israeli History'),
  ('Biology',           'Cell Biology, Genetics, Ecology'),
  ('Chemistry',         'Organic and Inorganic Chemistry'),
  ('Physics',           'Mechanics, Electricity, Optics'),
  ('Geography',         'Physical and Human Geography'),
  ('Computer Science',  'Programming, Algorithms, Data Structures'),
  ('Art',               'Drawing, Painting, Art History'),
  ('Physical Education','Sports, Fitness, Teamwork'),
  ('Civic Education',   'Democracy, Law, Society');

-- ── Classes ───────────────────────────────────────────────────
INSERT INTO classes (name, student_count, grade_level_id, academic_year) VALUES
  ('9A', 26,(SELECT id FROM grade_levels WHERE code='9'), '2025-2026'),
  ('9B', 27,(SELECT id FROM grade_levels WHERE code='9'), '2025-2026'),
  ('9C', 28,(SELECT id FROM grade_levels WHERE code='9'), '2025-2026'),
  ('10A',26,(SELECT id FROM grade_levels WHERE code='10'),'2025-2026'),
  ('10B',27,(SELECT id FROM grade_levels WHERE code='10'),'2025-2026'),
  ('10C',28,(SELECT id FROM grade_levels WHERE code='10'),'2025-2026'),
  ('11A',26,(SELECT id FROM grade_levels WHERE code='11'),'2025-2026'),
  ('11B',27,(SELECT id FROM grade_levels WHERE code='11'),'2025-2026'),
  ('11C',26,(SELECT id FROM grade_levels WHERE code='11'),'2025-2026'),
  ('12A',25,(SELECT id FROM grade_levels WHERE code='12'),'2025-2026'),
  ('12B',26,(SELECT id FROM grade_levels WHERE code='12'),'2025-2026'),
  ('12C',27,(SELECT id FROM grade_levels WHERE code='12'),'2025-2026');

-- ── Helper variables ──────────────────────────────────────────
SET @r_admin = (SELECT id FROM roles WHERE name='admin');
SET @r_sec   = (SELECT id FROM roles WHERE name='secretary');
SET @r_teach = (SELECT id FROM roles WHERE name='teacher');
SET @pw      = '$2a$12$y8htSJCWQSWLXzd28DD1X.O7d68CWxGDPzbqr2WVviba8.lAa7coO';

-- ── Users (18 total) ──────────────────────────────────────────
INSERT INTO users (name, email, role_id, phone, is_homeroom) VALUES
  -- Admin
  ('Moshe Katz',         'admin@gmail.com',            @r_admin, '052-1000000', FALSE),
  -- Secretaries
  ('Sarah Cohen',        'secretary1@gmail.com',       @r_sec,   '052-2000001', FALSE),
  ('Rivka Ben-David',    'secretary2@gmail.com',       @r_sec,   '052-2000002', FALSE),
  -- Homeroom teachers (12)
  ('Avi Cohen',          'avi.cohen@gmail.com',        @r_teach, '052-3000001', TRUE),
  ('Maya Levi',          'maya.levi@gmail.com',        @r_teach, '052-3000002', TRUE),
  ('David Mizrahi',      'david.mizrahi@gmail.com',    @r_teach, '052-3000003', TRUE),
  ('Sarah Peretz',       'sarah.peretz@gmail.com',     @r_teach, '052-3000004', TRUE),
  ('Roi Katz',           'roi.katz@gmail.com',         @r_teach, '052-3000005', TRUE),
  ('Tamar Friedman',     'tamar.friedman@gmail.com',   @r_teach, '052-3000006', TRUE),
  ('Yoni Shapiro',       'yoni.shapiro@gmail.com',     @r_teach, '052-3000007', TRUE),
  ('Noa Rosenberg',      'noa.rosenberg@gmail.com',    @r_teach, '052-3000008', TRUE),
  ('Eitan Klein',        'eitan.klein@gmail.com',      @r_teach, '052-3000009', TRUE),
  ('Liron Goldstein',    'liron.goldstein@gmail.com',  @r_teach, '052-3000010', TRUE),
  ('Gal Stern',          'gal.stern@gmail.com',        @r_teach, '052-3000011', TRUE),
  ('Dana Schwartz',      'dana.schwartz@gmail.com',    @r_teach, '052-3000012', TRUE),
  -- Extra teachers (3)
  ('Ron Weiss',          'ron.weiss@gmail.com',        @r_teach, '052-3000013', FALSE),
  ('Hila Horowitz',      'hila.horowitz@gmail.com',    @r_teach, '052-3000014', FALSE),
  ('Tal Becker',         'tal.becker@gmail.com',       @r_teach, '052-3000015', FALSE);

-- ── Credentials ───────────────────────────────────────────────
INSERT INTO user_credentials (user_id, password_hash)
SELECT id, @pw FROM users;

-- ── Teacher → Classes ─────────────────────────────────────────
-- Avi (9A homeroom): Math + Physics → 9th grade
INSERT INTO teacher_classes (teacher_id, class_id)
SELECT u.id, c.id FROM users u CROSS JOIN classes c
WHERE u.email='avi.cohen@gmail.com' AND c.name IN ('9A','9B','9C');

-- Maya (9B homeroom): English + Hebrew Lit → 9th grade
INSERT INTO teacher_classes (teacher_id, class_id)
SELECT u.id, c.id FROM users u CROSS JOIN classes c
WHERE u.email='maya.levi@gmail.com' AND c.name IN ('9A','9B','9C');

-- David (9C homeroom): History + Geography → 9th grade
INSERT INTO teacher_classes (teacher_id, class_id)
SELECT u.id, c.id FROM users u CROSS JOIN classes c
WHERE u.email='david.mizrahi@gmail.com' AND c.name IN ('9A','9B','9C');

-- Sarah (10A homeroom): Biology + Chemistry → 10th grade
INSERT INTO teacher_classes (teacher_id, class_id)
SELECT u.id, c.id FROM users u CROSS JOIN classes c
WHERE u.email='sarah.peretz@gmail.com' AND c.name IN ('10A','10B','10C');

-- Roi (10B homeroom): CS + Civic Ed → 10th grade
INSERT INTO teacher_classes (teacher_id, class_id)
SELECT u.id, c.id FROM users u CROSS JOIN classes c
WHERE u.email='roi.katz@gmail.com' AND c.name IN ('10A','10B','10C');

-- Tamar (10C homeroom): Art + PE → 10th grade
INSERT INTO teacher_classes (teacher_id, class_id)
SELECT u.id, c.id FROM users u CROSS JOIN classes c
WHERE u.email='tamar.friedman@gmail.com' AND c.name IN ('10A','10B','10C');

-- Yoni (11A homeroom): Math + Physics → 11th grade
INSERT INTO teacher_classes (teacher_id, class_id)
SELECT u.id, c.id FROM users u CROSS JOIN classes c
WHERE u.email='yoni.shapiro@gmail.com' AND c.name IN ('11A','11B','11C');

-- Noa (11B homeroom): Biology + Chemistry → 11th grade
INSERT INTO teacher_classes (teacher_id, class_id)
SELECT u.id, c.id FROM users u CROSS JOIN classes c
WHERE u.email='noa.rosenberg@gmail.com' AND c.name IN ('11A','11B','11C');

-- Eitan (11C homeroom): English + Hebrew Lit → 11th grade
INSERT INTO teacher_classes (teacher_id, class_id)
SELECT u.id, c.id FROM users u CROSS JOIN classes c
WHERE u.email='eitan.klein@gmail.com' AND c.name IN ('11A','11B','11C');

-- Liron (12A homeroom): History + Geography → 12th grade
INSERT INTO teacher_classes (teacher_id, class_id)
SELECT u.id, c.id FROM users u CROSS JOIN classes c
WHERE u.email='liron.goldstein@gmail.com' AND c.name IN ('12A','12B','12C');

-- Gal (12B homeroom): CS + Math → 12th grade
INSERT INTO teacher_classes (teacher_id, class_id)
SELECT u.id, c.id FROM users u CROSS JOIN classes c
WHERE u.email='gal.stern@gmail.com' AND c.name IN ('12A','12B','12C');

-- Dana (12C homeroom): Art + PE → 12th grade
INSERT INTO teacher_classes (teacher_id, class_id)
SELECT u.id, c.id FROM users u CROSS JOIN classes c
WHERE u.email='dana.schwartz@gmail.com' AND c.name IN ('12A','12B','12C');

-- Ron: Civic Ed + PE → 9th & 11th grade
INSERT INTO teacher_classes (teacher_id, class_id)
SELECT u.id, c.id FROM users u CROSS JOIN classes c
WHERE u.email='ron.weiss@gmail.com' AND c.name IN ('9A','9B','9C','11A','11B','11C');

-- Hila: Math → 10th grade
INSERT INTO teacher_classes (teacher_id, class_id)
SELECT u.id, c.id FROM users u CROSS JOIN classes c
WHERE u.email='hila.horowitz@gmail.com' AND c.name IN ('10A','10B','10C');

-- Tal: Hebrew Lit + Physics → 12th grade
INSERT INTO teacher_classes (teacher_id, class_id)
SELECT u.id, c.id FROM users u CROSS JOIN classes c
WHERE u.email='tal.becker@gmail.com' AND c.name IN ('12A','12B','12C');

-- ── Teacher → Subjects ────────────────────────────────────────
INSERT INTO teacher_subjects (teacher_id, subject_id)
SELECT u.id, s.id FROM users u CROSS JOIN subjects s
WHERE u.email='avi.cohen@gmail.com'      AND s.name IN ('Mathematics','Physics');

INSERT INTO teacher_subjects (teacher_id, subject_id)
SELECT u.id, s.id FROM users u CROSS JOIN subjects s
WHERE u.email='maya.levi@gmail.com'      AND s.name IN ('English','Hebrew Literature');

INSERT INTO teacher_subjects (teacher_id, subject_id)
SELECT u.id, s.id FROM users u CROSS JOIN subjects s
WHERE u.email='david.mizrahi@gmail.com'  AND s.name IN ('History','Geography');

INSERT INTO teacher_subjects (teacher_id, subject_id)
SELECT u.id, s.id FROM users u CROSS JOIN subjects s
WHERE u.email='sarah.peretz@gmail.com'   AND s.name IN ('Biology','Chemistry');

INSERT INTO teacher_subjects (teacher_id, subject_id)
SELECT u.id, s.id FROM users u CROSS JOIN subjects s
WHERE u.email='roi.katz@gmail.com'       AND s.name IN ('Computer Science','Civic Education');

INSERT INTO teacher_subjects (teacher_id, subject_id)
SELECT u.id, s.id FROM users u CROSS JOIN subjects s
WHERE u.email='tamar.friedman@gmail.com' AND s.name IN ('Art','Physical Education');

INSERT INTO teacher_subjects (teacher_id, subject_id)
SELECT u.id, s.id FROM users u CROSS JOIN subjects s
WHERE u.email='yoni.shapiro@gmail.com'   AND s.name IN ('Mathematics','Physics');

INSERT INTO teacher_subjects (teacher_id, subject_id)
SELECT u.id, s.id FROM users u CROSS JOIN subjects s
WHERE u.email='noa.rosenberg@gmail.com'  AND s.name IN ('Biology','Chemistry');

INSERT INTO teacher_subjects (teacher_id, subject_id)
SELECT u.id, s.id FROM users u CROSS JOIN subjects s
WHERE u.email='eitan.klein@gmail.com'    AND s.name IN ('English','Hebrew Literature');

INSERT INTO teacher_subjects (teacher_id, subject_id)
SELECT u.id, s.id FROM users u CROSS JOIN subjects s
WHERE u.email='liron.goldstein@gmail.com' AND s.name IN ('History','Geography');

INSERT INTO teacher_subjects (teacher_id, subject_id)
SELECT u.id, s.id FROM users u CROSS JOIN subjects s
WHERE u.email='gal.stern@gmail.com'      AND s.name IN ('Computer Science','Mathematics');

INSERT INTO teacher_subjects (teacher_id, subject_id)
SELECT u.id, s.id FROM users u CROSS JOIN subjects s
WHERE u.email='dana.schwartz@gmail.com'  AND s.name IN ('Art','Physical Education');

INSERT INTO teacher_subjects (teacher_id, subject_id)
SELECT u.id, s.id FROM users u CROSS JOIN subjects s
WHERE u.email='ron.weiss@gmail.com'      AND s.name IN ('Physical Education','Civic Education');

INSERT INTO teacher_subjects (teacher_id, subject_id)
SELECT u.id, s.id FROM users u CROSS JOIN subjects s
WHERE u.email='hila.horowitz@gmail.com'  AND s.name IN ('Mathematics');

INSERT INTO teacher_subjects (teacher_id, subject_id)
SELECT u.id, s.id FROM users u CROSS JOIN subjects s
WHERE u.email='tal.becker@gmail.com'     AND s.name IN ('Hebrew Literature','Physics');

-- ── Homeroom assignments ──────────────────────────────────────
INSERT INTO teacher_homeroom_classes (teacher_id, class_id) VALUES
  ((SELECT id FROM users WHERE email='avi.cohen@gmail.com'),     (SELECT id FROM classes WHERE name='9A')),
  ((SELECT id FROM users WHERE email='maya.levi@gmail.com'),     (SELECT id FROM classes WHERE name='9B')),
  ((SELECT id FROM users WHERE email='david.mizrahi@gmail.com'), (SELECT id FROM classes WHERE name='9C')),
  ((SELECT id FROM users WHERE email='sarah.peretz@gmail.com'),  (SELECT id FROM classes WHERE name='10A')),
  ((SELECT id FROM users WHERE email='roi.katz@gmail.com'),      (SELECT id FROM classes WHERE name='10B')),
  ((SELECT id FROM users WHERE email='tamar.friedman@gmail.com'),(SELECT id FROM classes WHERE name='10C')),
  ((SELECT id FROM users WHERE email='yoni.shapiro@gmail.com'),  (SELECT id FROM classes WHERE name='11A')),
  ((SELECT id FROM users WHERE email='noa.rosenberg@gmail.com'), (SELECT id FROM classes WHERE name='11B')),
  ((SELECT id FROM users WHERE email='eitan.klein@gmail.com'),   (SELECT id FROM classes WHERE name='11C')),
  ((SELECT id FROM users WHERE email='liron.goldstein@gmail.com'),(SELECT id FROM classes WHERE name='12A')),
  ((SELECT id FROM users WHERE email='gal.stern@gmail.com'),     (SELECT id FROM classes WHERE name='12B')),
  ((SELECT id FROM users WHERE email='dana.schwartz@gmail.com'), (SELECT id FROM classes WHERE name='12C'));

-- ── Students ──────────────────────────────────────────────────

-- 9A (26)
SET @c9A = (SELECT id FROM classes WHERE name='9A');
INSERT INTO students (name, class_id, student_number, phone_father) VALUES
('Yosef Cohen',     @c9A,'9A001','050-1110001'),('Sara Levi',       @c9A,'9A002','050-1110002'),
('David Mizrahi',   @c9A,'9A003','050-1110003'),('Miriam Peretz',   @c9A,'9A004','050-1110004'),
('Avi Katz',        @c9A,'9A005','050-1110005'),('Noa Friedman',    @c9A,'9A006','050-1110006'),
('Guy Shapiro',     @c9A,'9A007','050-1110007'),('Rachel Klein',    @c9A,'9A008','050-1110008'),
('Eitan Goldstein', @c9A,'9A009','050-1110009'),('Shira Blum',      @c9A,'9A010','050-1110010'),
('Natan Stern',     @c9A,'9A011','050-1110011'),('Michal Schwartz', @c9A,'9A012','050-1110012'),
('Roi Weiss',       @c9A,'9A013','050-1110013'),('Tali Horowitz',   @c9A,'9A014','050-1110014'),
('Tom Becker',      @c9A,'9A015','050-1110015'),('Hila Levy',       @c9A,'9A016','050-1110016'),
('Itay Ben-David',  @c9A,'9A017','050-1110017'),('Maya Azulay',     @c9A,'9A018','050-1110018'),
('Or Dahan',        @c9A,'9A019','050-1110019'),('Nili Green',      @c9A,'9A020','050-1110020'),
('Noam Bar',        @c9A,'9A021','050-1110021'),('Yael Sharon',     @c9A,'9A022','050-1110022'),
('Omer Zamir',      @c9A,'9A023','050-1110023'),('Gal Cohen',       @c9A,'9A024','050-1110024'),
('Bar Levi',        @c9A,'9A025','050-1110025'),('Dana Mizrahi',    @c9A,'9A026','050-1110026');

-- 9B (27)
SET @c9B = (SELECT id FROM classes WHERE name='9B');
INSERT INTO students (name, class_id, student_number, phone_father) VALUES
('Amir Cohen',      @c9B,'9B001','050-1120001'),('Shani Levi',      @c9B,'9B002','050-1120002'),
('Jonathan Mizrahi',@c9B,'9B003','050-1120003'),('Tamar Peretz',    @c9B,'9B004','050-1120004'),
('Lior Katz',       @c9B,'9B005','050-1120005'),('Gali Friedman',   @c9B,'9B006','050-1120006'),
('Barak Shapiro',   @c9B,'9B007','050-1120007'),('Efrat Klein',     @c9B,'9B008','050-1120008'),
('Dor Goldstein',   @c9B,'9B009','050-1120009'),('Ayelet Blum',     @c9B,'9B010','050-1120010'),
('Uri Stern',       @c9B,'9B011','050-1120011'),('Rinat Schwartz',  @c9B,'9B012','050-1120012'),
('Yair Weiss',      @c9B,'9B013','050-1120013'),('Hadas Horowitz',  @c9B,'9B014','050-1120014'),
('Ido Becker',      @c9B,'9B015','050-1120015'),('Liron Levy',      @c9B,'9B016','050-1120016'),
('Nimrod Ben-David',@c9B,'9B017','050-1120017'),('Rotem Azulay',    @c9B,'9B018','050-1120018'),
('Ariel Dahan',     @c9B,'9B019','050-1120019'),('Shahar Green',    @c9B,'9B020','050-1120020'),
('Tal Bar',         @c9B,'9B021','050-1120021'),('Merav Sharon',    @c9B,'9B022','050-1120022'),
('Ran Zamir',       @c9B,'9B023','050-1120023'),('Orit Cohen',      @c9B,'9B024','050-1120024'),
('Nir Levi',        @c9B,'9B025','050-1120025'),('Sivan Mizrahi',   @c9B,'9B026','050-1120026'),
('Ilan Peretz',     @c9B,'9B027','050-1120027');

-- 9C (28)
SET @c9C = (SELECT id FROM classes WHERE name='9C');
INSERT INTO students (name, class_id, student_number, phone_father) VALUES
('Maayan Cohen',    @c9C,'9C001','050-1130001'),('Yotam Levi',      @c9C,'9C002','050-1130002'),
('Inbar Mizrahi',   @c9C,'9C003','050-1130003'),('Daniel Peretz',   @c9C,'9C004','050-1130004'),
('Keren Katz',      @c9C,'9C005','050-1130005'),('Ofir Friedman',   @c9C,'9C006','050-1130006'),
('Sigal Shapiro',   @c9C,'9C007','050-1130007'),('Oren Klein',      @c9C,'9C008','050-1130008'),
('Naama Goldstein', @c9C,'9C009','050-1130009'),('Dvir Blum',       @c9C,'9C010','050-1130010'),
('Coral Stern',     @c9C,'9C011','050-1130011'),('Gil Schwartz',     @c9C,'9C012','050-1130012'),
('Yarden Weiss',    @c9C,'9C013','050-1130013'),('Nevet Horowitz',   @c9C,'9C014','050-1130014'),
('Asaf Becker',     @c9C,'9C015','050-1130015'),('Anat Levy',        @c9C,'9C016','050-1130016'),
('Dani Ben-David',  @c9C,'9C017','050-1130017'),('Tomer Azulay',    @c9C,'9C018','050-1130018'),
('Hanna Dahan',     @c9C,'9C019','050-1130019'),('Elad Green',      @c9C,'9C020','050-1130020'),
('Mor Bar',         @c9C,'9C021','050-1130021'),('Karin Sharon',     @c9C,'9C022','050-1130022'),
('Ohad Zamir',      @c9C,'9C023','050-1130023'),('Zohar Cohen',     @c9C,'9C024','050-1130024'),
('Yifat Levi',      @c9C,'9C025','050-1130025'),('Benny Mizrahi',   @c9C,'9C026','050-1130026'),
('Tzur Peretz',     @c9C,'9C027','050-1130027'),('Liat Katz',       @c9C,'9C028','050-1130028');

-- 10A (26)
SET @c10A = (SELECT id FROM classes WHERE name='10A');
INSERT INTO students (name, class_id, student_number, phone_father) VALUES
('Yosef Cohen',     @c10A,'10A001','050-2110001'),('Sara Levi',      @c10A,'10A002','050-2110002'),
('David Mizrahi',   @c10A,'10A003','050-2110003'),('Miriam Peretz',  @c10A,'10A004','050-2110004'),
('Avi Katz',        @c10A,'10A005','050-2110005'),('Noa Friedman',   @c10A,'10A006','050-2110006'),
('Guy Shapiro',     @c10A,'10A007','050-2110007'),('Rachel Klein',   @c10A,'10A008','050-2110008'),
('Eitan Goldstein', @c10A,'10A009','050-2110009'),('Shira Blum',     @c10A,'10A010','050-2110010'),
('Natan Stern',     @c10A,'10A011','050-2110011'),('Michal Schwartz',@c10A,'10A012','050-2110012'),
('Roi Weiss',       @c10A,'10A013','050-2110013'),('Tali Horowitz',  @c10A,'10A014','050-2110014'),
('Tom Becker',      @c10A,'10A015','050-2110015'),('Hila Levy',      @c10A,'10A016','050-2110016'),
('Itay Ben-David',  @c10A,'10A017','050-2110017'),('Maya Azulay',    @c10A,'10A018','050-2110018'),
('Or Dahan',        @c10A,'10A019','050-2110019'),('Nili Green',     @c10A,'10A020','050-2110020'),
('Noam Bar',        @c10A,'10A021','050-2110021'),('Yael Sharon',    @c10A,'10A022','050-2110022'),
('Omer Zamir',      @c10A,'10A023','050-2110023'),('Gal Cohen',      @c10A,'10A024','050-2110024'),
('Bar Levi',        @c10A,'10A025','050-2110025'),('Dana Mizrahi',   @c10A,'10A026','050-2110026');

-- 10B (27)
SET @c10B = (SELECT id FROM classes WHERE name='10B');
INSERT INTO students (name, class_id, student_number, phone_father) VALUES
('Amir Cohen',      @c10B,'10B001','050-2120001'),('Shani Levi',     @c10B,'10B002','050-2120002'),
('Jonathan Mizrahi',@c10B,'10B003','050-2120003'),('Tamar Peretz',   @c10B,'10B004','050-2120004'),
('Lior Katz',       @c10B,'10B005','050-2120005'),('Gali Friedman',  @c10B,'10B006','050-2120006'),
('Barak Shapiro',   @c10B,'10B007','050-2120007'),('Efrat Klein',    @c10B,'10B008','050-2120008'),
('Dor Goldstein',   @c10B,'10B009','050-2120009'),('Ayelet Blum',    @c10B,'10B010','050-2120010'),
('Uri Stern',       @c10B,'10B011','050-2120011'),('Rinat Schwartz', @c10B,'10B012','050-2120012'),
('Yair Weiss',      @c10B,'10B013','050-2120013'),('Hadas Horowitz', @c10B,'10B014','050-2120014'),
('Ido Becker',      @c10B,'10B015','050-2120015'),('Liron Levy',     @c10B,'10B016','050-2120016'),
('Nimrod Ben-David',@c10B,'10B017','050-2120017'),('Rotem Azulay',   @c10B,'10B018','050-2120018'),
('Ariel Dahan',     @c10B,'10B019','050-2120019'),('Shahar Green',   @c10B,'10B020','050-2120020'),
('Tal Bar',         @c10B,'10B021','050-2120021'),('Merav Sharon',   @c10B,'10B022','050-2120022'),
('Ran Zamir',       @c10B,'10B023','050-2120023'),('Orit Cohen',     @c10B,'10B024','050-2120024'),
('Nir Levi',        @c10B,'10B025','050-2120025'),('Sivan Mizrahi',  @c10B,'10B026','050-2120026'),
('Ilan Peretz',     @c10B,'10B027','050-2120027');

-- 10C (28)
SET @c10C = (SELECT id FROM classes WHERE name='10C');
INSERT INTO students (name, class_id, student_number, phone_father) VALUES
('Maayan Cohen',    @c10C,'10C001','050-2130001'),('Yotam Levi',     @c10C,'10C002','050-2130002'),
('Inbar Mizrahi',   @c10C,'10C003','050-2130003'),('Daniel Peretz',  @c10C,'10C004','050-2130004'),
('Keren Katz',      @c10C,'10C005','050-2130005'),('Ofir Friedman',  @c10C,'10C006','050-2130006'),
('Sigal Shapiro',   @c10C,'10C007','050-2130007'),('Oren Klein',     @c10C,'10C008','050-2130008'),
('Naama Goldstein', @c10C,'10C009','050-2130009'),('Dvir Blum',      @c10C,'10C010','050-2130010'),
('Coral Stern',     @c10C,'10C011','050-2130011'),('Gil Schwartz',    @c10C,'10C012','050-2130012'),
('Yarden Weiss',    @c10C,'10C013','050-2130013'),('Nevet Horowitz',  @c10C,'10C014','050-2130014'),
('Asaf Becker',     @c10C,'10C015','050-2130015'),('Anat Levy',       @c10C,'10C016','050-2130016'),
('Dani Ben-David',  @c10C,'10C017','050-2130017'),('Tomer Azulay',   @c10C,'10C018','050-2130018'),
('Hanna Dahan',     @c10C,'10C019','050-2130019'),('Elad Green',     @c10C,'10C020','050-2130020'),
('Mor Bar',         @c10C,'10C021','050-2130021'),('Karin Sharon',    @c10C,'10C022','050-2130022'),
('Ohad Zamir',      @c10C,'10C023','050-2130023'),('Zohar Cohen',    @c10C,'10C024','050-2130024'),
('Yifat Levi',      @c10C,'10C025','050-2130025'),('Benny Mizrahi',  @c10C,'10C026','050-2130026'),
('Tzur Peretz',     @c10C,'10C027','050-2130027'),('Liat Katz',      @c10C,'10C028','050-2130028');

-- 11A (26)
SET @c11A = (SELECT id FROM classes WHERE name='11A');
INSERT INTO students (name, class_id, student_number, phone_father) VALUES
('Yosef Cohen',     @c11A,'11A001','050-3110001'),('Sara Levi',      @c11A,'11A002','050-3110002'),
('David Mizrahi',   @c11A,'11A003','050-3110003'),('Miriam Peretz',  @c11A,'11A004','050-3110004'),
('Avi Katz',        @c11A,'11A005','050-3110005'),('Noa Friedman',   @c11A,'11A006','050-3110006'),
('Guy Shapiro',     @c11A,'11A007','050-3110007'),('Rachel Klein',   @c11A,'11A008','050-3110008'),
('Eitan Goldstein', @c11A,'11A009','050-3110009'),('Shira Blum',     @c11A,'11A010','050-3110010'),
('Natan Stern',     @c11A,'11A011','050-3110011'),('Michal Schwartz',@c11A,'11A012','050-3110012'),
('Roi Weiss',       @c11A,'11A013','050-3110013'),('Tali Horowitz',  @c11A,'11A014','050-3110014'),
('Tom Becker',      @c11A,'11A015','050-3110015'),('Hila Levy',      @c11A,'11A016','050-3110016'),
('Itay Ben-David',  @c11A,'11A017','050-3110017'),('Maya Azulay',    @c11A,'11A018','050-3110018'),
('Or Dahan',        @c11A,'11A019','050-3110019'),('Nili Green',     @c11A,'11A020','050-3110020'),
('Noam Bar',        @c11A,'11A021','050-3110021'),('Yael Sharon',    @c11A,'11A022','050-3110022'),
('Omer Zamir',      @c11A,'11A023','050-3110023'),('Gal Cohen',      @c11A,'11A024','050-3110024'),
('Bar Levi',        @c11A,'11A025','050-3110025'),('Dana Mizrahi',   @c11A,'11A026','050-3110026');

-- 11B (27)
SET @c11B = (SELECT id FROM classes WHERE name='11B');
INSERT INTO students (name, class_id, student_number, phone_father) VALUES
('Amir Cohen',      @c11B,'11B001','050-3120001'),('Shani Levi',     @c11B,'11B002','050-3120002'),
('Jonathan Mizrahi',@c11B,'11B003','050-3120003'),('Tamar Peretz',   @c11B,'11B004','050-3120004'),
('Lior Katz',       @c11B,'11B005','050-3120005'),('Gali Friedman',  @c11B,'11B006','050-3120006'),
('Barak Shapiro',   @c11B,'11B007','050-3120007'),('Efrat Klein',    @c11B,'11B008','050-3120008'),
('Dor Goldstein',   @c11B,'11B009','050-3120009'),('Ayelet Blum',    @c11B,'11B010','050-3120010'),
('Uri Stern',       @c11B,'11B011','050-3120011'),('Rinat Schwartz', @c11B,'11B012','050-3120012'),
('Yair Weiss',      @c11B,'11B013','050-3120013'),('Hadas Horowitz', @c11B,'11B014','050-3120014'),
('Ido Becker',      @c11B,'11B015','050-3120015'),('Liron Levy',     @c11B,'11B016','050-3120016'),
('Nimrod Ben-David',@c11B,'11B017','050-3120017'),('Rotem Azulay',   @c11B,'11B018','050-3120018'),
('Ariel Dahan',     @c11B,'11B019','050-3120019'),('Shahar Green',   @c11B,'11B020','050-3120020'),
('Tal Bar',         @c11B,'11B021','050-3120021'),('Merav Sharon',   @c11B,'11B022','050-3120022'),
('Ran Zamir',       @c11B,'11B023','050-3120023'),('Orit Cohen',     @c11B,'11B024','050-3120024'),
('Nir Levi',        @c11B,'11B025','050-3120025'),('Sivan Mizrahi',  @c11B,'11B026','050-3120026'),
('Ilan Peretz',     @c11B,'11B027','050-3120027');

-- 11C (26)
SET @c11C = (SELECT id FROM classes WHERE name='11C');
INSERT INTO students (name, class_id, student_number, phone_father) VALUES
('Maayan Cohen',    @c11C,'11C001','050-3130001'),('Yotam Levi',     @c11C,'11C002','050-3130002'),
('Inbar Mizrahi',   @c11C,'11C003','050-3130003'),('Daniel Peretz',  @c11C,'11C004','050-3130004'),
('Keren Katz',      @c11C,'11C005','050-3130005'),('Ofir Friedman',  @c11C,'11C006','050-3130006'),
('Sigal Shapiro',   @c11C,'11C007','050-3130007'),('Oren Klein',     @c11C,'11C008','050-3130008'),
('Naama Goldstein', @c11C,'11C009','050-3130009'),('Dvir Blum',      @c11C,'11C010','050-3130010'),
('Coral Stern',     @c11C,'11C011','050-3130011'),('Gil Schwartz',    @c11C,'11C012','050-3130012'),
('Yarden Weiss',    @c11C,'11C013','050-3130013'),('Nevet Horowitz',  @c11C,'11C014','050-3130014'),
('Asaf Becker',     @c11C,'11C015','050-3130015'),('Anat Levy',       @c11C,'11C016','050-3130016'),
('Dani Ben-David',  @c11C,'11C017','050-3130017'),('Tomer Azulay',   @c11C,'11C018','050-3130018'),
('Hanna Dahan',     @c11C,'11C019','050-3130019'),('Elad Green',     @c11C,'11C020','050-3130020'),
('Mor Bar',         @c11C,'11C021','050-3130021'),('Karin Sharon',    @c11C,'11C022','050-3130022'),
('Ohad Zamir',      @c11C,'11C023','050-3130023'),('Zohar Cohen',    @c11C,'11C024','050-3130024'),
('Yifat Levi',      @c11C,'11C025','050-3130025'),('Benny Mizrahi',  @c11C,'11C026','050-3130026');

-- 12A (25)
SET @c12A = (SELECT id FROM classes WHERE name='12A');
INSERT INTO students (name, class_id, student_number, phone_father) VALUES
('Yosef Cohen',     @c12A,'12A001','050-4110001'),('Sara Levi',      @c12A,'12A002','050-4110002'),
('David Mizrahi',   @c12A,'12A003','050-4110003'),('Miriam Peretz',  @c12A,'12A004','050-4110004'),
('Avi Katz',        @c12A,'12A005','050-4110005'),('Noa Friedman',   @c12A,'12A006','050-4110006'),
('Guy Shapiro',     @c12A,'12A007','050-4110007'),('Rachel Klein',   @c12A,'12A008','050-4110008'),
('Eitan Goldstein', @c12A,'12A009','050-4110009'),('Shira Blum',     @c12A,'12A010','050-4110010'),
('Natan Stern',     @c12A,'12A011','050-4110011'),('Michal Schwartz',@c12A,'12A012','050-4110012'),
('Roi Weiss',       @c12A,'12A013','050-4110013'),('Tali Horowitz',  @c12A,'12A014','050-4110014'),
('Tom Becker',      @c12A,'12A015','050-4110015'),('Hila Levy',      @c12A,'12A016','050-4110016'),
('Itay Ben-David',  @c12A,'12A017','050-4110017'),('Maya Azulay',    @c12A,'12A018','050-4110018'),
('Or Dahan',        @c12A,'12A019','050-4110019'),('Nili Green',     @c12A,'12A020','050-4110020'),
('Noam Bar',        @c12A,'12A021','050-4110021'),('Yael Sharon',    @c12A,'12A022','050-4110022'),
('Omer Zamir',      @c12A,'12A023','050-4110023'),('Gal Cohen',      @c12A,'12A024','050-4110024'),
('Bar Levi',        @c12A,'12A025','050-4110025');

-- 12B (26)
SET @c12B = (SELECT id FROM classes WHERE name='12B');
INSERT INTO students (name, class_id, student_number, phone_father) VALUES
('Amir Cohen',      @c12B,'12B001','050-4120001'),('Shani Levi',     @c12B,'12B002','050-4120002'),
('Jonathan Mizrahi',@c12B,'12B003','050-4120003'),('Tamar Peretz',   @c12B,'12B004','050-4120004'),
('Lior Katz',       @c12B,'12B005','050-4120005'),('Gali Friedman',  @c12B,'12B006','050-4120006'),
('Barak Shapiro',   @c12B,'12B007','050-4120007'),('Efrat Klein',    @c12B,'12B008','050-4120008'),
('Dor Goldstein',   @c12B,'12B009','050-4120009'),('Ayelet Blum',    @c12B,'12B010','050-4120010'),
('Uri Stern',       @c12B,'12B011','050-4120011'),('Rinat Schwartz', @c12B,'12B012','050-4120012'),
('Yair Weiss',      @c12B,'12B013','050-4120013'),('Hadas Horowitz', @c12B,'12B014','050-4120014'),
('Ido Becker',      @c12B,'12B015','050-4120015'),('Liron Levy',     @c12B,'12B016','050-4120016'),
('Nimrod Ben-David',@c12B,'12B017','050-4120017'),('Rotem Azulay',   @c12B,'12B018','050-4120018'),
('Ariel Dahan',     @c12B,'12B019','050-4120019'),('Shahar Green',   @c12B,'12B020','050-4120020'),
('Tal Bar',         @c12B,'12B021','050-4120021'),('Merav Sharon',   @c12B,'12B022','050-4120022'),
('Ran Zamir',       @c12B,'12B023','050-4120023'),('Orit Cohen',     @c12B,'12B024','050-4120024'),
('Nir Levi',        @c12B,'12B025','050-4120025'),('Sivan Mizrahi',  @c12B,'12B026','050-4120026');

-- 12C (27)
SET @c12C = (SELECT id FROM classes WHERE name='12C');
INSERT INTO students (name, class_id, student_number, phone_father) VALUES
('Maayan Cohen',    @c12C,'12C001','050-4130001'),('Yotam Levi',     @c12C,'12C002','050-4130002'),
('Inbar Mizrahi',   @c12C,'12C003','050-4130003'),('Daniel Peretz',  @c12C,'12C004','050-4130004'),
('Keren Katz',      @c12C,'12C005','050-4130005'),('Ofir Friedman',  @c12C,'12C006','050-4130006'),
('Sigal Shapiro',   @c12C,'12C007','050-4130007'),('Oren Klein',     @c12C,'12C008','050-4130008'),
('Naama Goldstein', @c12C,'12C009','050-4130009'),('Dvir Blum',      @c12C,'12C010','050-4130010'),
('Coral Stern',     @c12C,'12C011','050-4130011'),('Gil Schwartz',    @c12C,'12C012','050-4130012'),
('Yarden Weiss',    @c12C,'12C013','050-4130013'),('Nevet Horowitz',  @c12C,'12C014','050-4130014'),
('Asaf Becker',     @c12C,'12C015','050-4130015'),('Anat Levy',       @c12C,'12C016','050-4130016'),
('Dani Ben-David',  @c12C,'12C017','050-4130017'),('Tomer Azulay',   @c12C,'12C018','050-4130018'),
('Hanna Dahan',     @c12C,'12C019','050-4130019'),('Elad Green',     @c12C,'12C020','050-4130020'),
('Mor Bar',         @c12C,'12C021','050-4130021'),('Karin Sharon',    @c12C,'12C022','050-4130022'),
('Ohad Zamir',      @c12C,'12C023','050-4130023'),('Zohar Cohen',    @c12C,'12C024','050-4130024'),
('Yifat Levi',      @c12C,'12C025','050-4130025'),('Benny Mizrahi',  @c12C,'12C026','050-4130026'),
('Tzur Peretz',     @c12C,'12C027','050-4130027');

-- ── Grades (bulk — quiz + test + midterm for every student/subject/teacher combo) ──
INSERT INTO grades (student_id, subject_id, teacher_id, exam_type_id, grade, max_grade, date)
SELECT
  s.id,
  ts.subject_id,
  tc.teacher_id,
  et.id,
  ROUND(55 + RAND() * 45, 1),
  100,
  DATE_SUB('2026-06-01', INTERVAL FLOOR(10 + RAND() * 260) DAY)
FROM students s
JOIN teacher_classes tc ON tc.class_id = s.class_id
JOIN teacher_subjects ts ON ts.teacher_id = tc.teacher_id
CROSS JOIN (SELECT id FROM exam_types WHERE code IN ('quiz','test','midterm')) et;

-- Final exam for each student/subject/teacher (added separately for realism)
INSERT INTO grades (student_id, subject_id, teacher_id, exam_type_id, grade, max_grade, date)
SELECT
  s.id,
  ts.subject_id,
  tc.teacher_id,
  (SELECT id FROM exam_types WHERE code='final'),
  ROUND(58 + RAND() * 42, 1),
  100,
  DATE_SUB('2026-06-01', INTERVAL FLOOR(1 + RAND() * 14) DAY)
FROM students s
JOIN teacher_classes tc ON tc.class_id = s.class_id
JOIN teacher_subjects ts ON ts.teacher_id = tc.teacher_id;

-- ── Grade comments (sample) ───────────────────────────────────
INSERT INTO grade_comments (grade_id, comment)
SELECT g.id, 'Great improvement this semester — keep it up!'
FROM grades g
ORDER BY RAND() LIMIT 40;

INSERT INTO grade_comments (grade_id, comment)
SELECT g.id, 'Needs to focus more during lessons and complete homework on time.'
FROM grades g
WHERE g.grade < 70
ORDER BY RAND() LIMIT 25;

INSERT INTO grade_comments (grade_id, comment)
SELECT g.id, 'Excellent work — among the top students in the class.'
FROM grades g
WHERE g.grade >= 90
ORDER BY RAND() LIMIT 20;

-- ── Print requests ────────────────────────────────────────────
SET @pp_normal    = (SELECT id FROM print_priorities WHERE code='normal');
SET @pp_important = (SELECT id FROM print_priorities WHERE code='important');
SET @pp_urgent    = (SELECT id FROM print_priorities WHERE code='urgent');
SET @ps_pending   = (SELECT id FROM print_statuses WHERE code='pending');
SET @ps_inprog    = (SELECT id FROM print_statuses WHERE code='in_progress');
SET @ps_printed   = (SELECT id FROM print_statuses WHERE code='printed');
SET @ps_complete  = (SELECT id FROM print_statuses WHERE code='completed');
SET @s_math       = (SELECT id FROM subjects WHERE name='Mathematics');
SET @s_eng        = (SELECT id FROM subjects WHERE name='English');
SET @s_hist       = (SELECT id FROM subjects WHERE name='History');
SET @s_bio        = (SELECT id FROM subjects WHERE name='Biology');
SET @s_cs         = (SELECT id FROM subjects WHERE name='Computer Science');
SET @s_phys       = (SELECT id FROM subjects WHERE name='Physics');
SET @s_chem       = (SELECT id FROM subjects WHERE name='Chemistry');
SET @t_avi        = (SELECT id FROM users WHERE email='avi.cohen@gmail.com');
SET @t_maya       = (SELECT id FROM users WHERE email='maya.levi@gmail.com');
SET @t_david      = (SELECT id FROM users WHERE email='david.mizrahi@gmail.com');
SET @t_sarah      = (SELECT id FROM users WHERE email='sarah.peretz@gmail.com');
SET @t_roi        = (SELECT id FROM users WHERE email='roi.katz@gmail.com');
SET @t_tamar      = (SELECT id FROM users WHERE email='tamar.friedman@gmail.com');
SET @t_yoni       = (SELECT id FROM users WHERE email='yoni.shapiro@gmail.com');
SET @t_noa        = (SELECT id FROM users WHERE email='noa.rosenberg@gmail.com');
SET @t_liron      = (SELECT id FROM users WHERE email='liron.goldstein@gmail.com');
SET @t_gal        = (SELECT id FROM users WHERE email='gal.stern@gmail.com');

INSERT INTO print_requests (teacher_id, subject_id, priority_id, status_id, lesson_date, lesson_time, total_copies, notes) VALUES
(@t_avi,   @s_math,  @pp_normal,    @ps_complete, '2026-02-10','09:00:00', 81,'Chapter 3 quiz — 9th grade'),
(@t_avi,   @s_phys,  @pp_important, @ps_complete, '2026-03-05','11:00:00', 81,'Electricity unit test'),
(@t_maya,  @s_eng,   @pp_normal,    @ps_printed,  '2026-04-01','10:00:00', 81,'Reading comprehension worksheet'),
(@t_david, @s_hist,  @pp_normal,    @ps_complete, '2026-02-20','08:00:00', 81,'WWI timeline exercise'),
(@t_sarah, @s_bio,   @pp_important, @ps_complete, '2026-03-15','09:00:00', 81,'Cell division diagram quiz'),
(@t_sarah, @s_chem,  @pp_urgent,    @ps_complete, '2026-04-10','13:00:00', 81,'Periodic table test'),
(@t_roi,   @s_cs,    @pp_normal,    @ps_printed,  '2026-05-01','12:00:00', 81,'Python basics exam'),
(@t_tamar, @s_math,  @pp_normal,    @ps_pending,  '2026-06-15','09:00:00', 81,'End of year review sheet'),
(@t_yoni,  @s_math,  @pp_important, @ps_inprog,   '2026-06-12','10:00:00', 79,'Calculus midterm — 11th grade'),
(@t_yoni,  @s_phys,  @pp_urgent,    @ps_pending,  '2026-06-18','11:00:00', 79,'Optics final exam'),
(@t_noa,   @s_bio,   @pp_normal,    @ps_complete, '2026-03-20','09:00:00', 79,'Genetics worksheet'),
(@t_noa,   @s_chem,  @pp_important, @ps_printed,  '2026-05-05','10:00:00', 79,'Organic chemistry test'),
(@t_liron, @s_hist,  @pp_normal,    @ps_complete, '2026-02-28','08:30:00', 78,'Israeli history essay prompt'),
(@t_gal,   @s_cs,    @pp_important, @ps_inprog,   '2026-06-10','13:00:00', 78,'Data structures final project'),
(@t_gal,   @s_math,  @pp_urgent,    @ps_pending,  '2026-06-20','09:00:00', 78,'Bagrut preparation — 12th grade');

-- Link print requests to classes
SET @pr1  = (SELECT id FROM print_requests WHERE teacher_id=@t_avi  AND lesson_date='2026-02-10');
SET @pr2  = (SELECT id FROM print_requests WHERE teacher_id=@t_avi  AND lesson_date='2026-03-05');
SET @pr3  = (SELECT id FROM print_requests WHERE teacher_id=@t_maya AND lesson_date='2026-04-01');
SET @pr4  = (SELECT id FROM print_requests WHERE teacher_id=@t_david AND lesson_date='2026-02-20');
SET @pr5  = (SELECT id FROM print_requests WHERE teacher_id=@t_sarah AND lesson_date='2026-03-15');
SET @pr6  = (SELECT id FROM print_requests WHERE teacher_id=@t_sarah AND lesson_date='2026-04-10');
SET @pr7  = (SELECT id FROM print_requests WHERE teacher_id=@t_roi   AND lesson_date='2026-05-01');
SET @pr8  = (SELECT id FROM print_requests WHERE teacher_id=@t_tamar AND lesson_date='2026-06-15');
SET @pr9  = (SELECT id FROM print_requests WHERE teacher_id=@t_yoni  AND lesson_date='2026-06-12');
SET @pr10 = (SELECT id FROM print_requests WHERE teacher_id=@t_yoni  AND lesson_date='2026-06-18');
SET @pr11 = (SELECT id FROM print_requests WHERE teacher_id=@t_noa   AND lesson_date='2026-03-20');
SET @pr12 = (SELECT id FROM print_requests WHERE teacher_id=@t_noa   AND lesson_date='2026-05-05');
SET @pr13 = (SELECT id FROM print_requests WHERE teacher_id=@t_liron AND lesson_date='2026-02-28');
SET @pr14 = (SELECT id FROM print_requests WHERE teacher_id=@t_gal   AND lesson_date='2026-06-10');
SET @pr15 = (SELECT id FROM print_requests WHERE teacher_id=@t_gal   AND lesson_date='2026-06-20');

INSERT INTO print_request_classes (print_request_id, class_id, copies_count)
SELECT @pr1, id, student_count FROM classes WHERE name IN ('9A','9B','9C');
INSERT INTO print_request_classes (print_request_id, class_id, copies_count)
SELECT @pr2, id, student_count FROM classes WHERE name IN ('9A','9B','9C');
INSERT INTO print_request_classes (print_request_id, class_id, copies_count)
SELECT @pr3, id, student_count FROM classes WHERE name IN ('9A','9B','9C');
INSERT INTO print_request_classes (print_request_id, class_id, copies_count)
SELECT @pr4, id, student_count FROM classes WHERE name IN ('9A','9B','9C');
INSERT INTO print_request_classes (print_request_id, class_id, copies_count)
SELECT @pr5, id, student_count FROM classes WHERE name IN ('10A','10B','10C');
INSERT INTO print_request_classes (print_request_id, class_id, copies_count)
SELECT @pr6, id, student_count FROM classes WHERE name IN ('10A','10B','10C');
INSERT INTO print_request_classes (print_request_id, class_id, copies_count)
SELECT @pr7, id, student_count FROM classes WHERE name IN ('10A','10B','10C');
INSERT INTO print_request_classes (print_request_id, class_id, copies_count)
SELECT @pr8, id, student_count FROM classes WHERE name IN ('10A','10B','10C');
INSERT INTO print_request_classes (print_request_id, class_id, copies_count)
SELECT @pr9, id, student_count FROM classes WHERE name IN ('11A','11B','11C');
INSERT INTO print_request_classes (print_request_id, class_id, copies_count)
SELECT @pr10, id, student_count FROM classes WHERE name IN ('11A','11B','11C');
INSERT INTO print_request_classes (print_request_id, class_id, copies_count)
SELECT @pr11, id, student_count FROM classes WHERE name IN ('11A','11B','11C');
INSERT INTO print_request_classes (print_request_id, class_id, copies_count)
SELECT @pr12, id, student_count FROM classes WHERE name IN ('11A','11B','11C');
INSERT INTO print_request_classes (print_request_id, class_id, copies_count)
SELECT @pr13, id, student_count FROM classes WHERE name IN ('12A','12B','12C');
INSERT INTO print_request_classes (print_request_id, class_id, copies_count)
SELECT @pr14, id, student_count FROM classes WHERE name IN ('12A','12B','12C');
INSERT INTO print_request_classes (print_request_id, class_id, copies_count)
SELECT @pr15, id, student_count FROM classes WHERE name IN ('12A','12B','12C');

-- ── Messages ──────────────────────────────────────────────────
SET @u_admin = (SELECT id FROM users WHERE email='admin@gmail.com');
SET @u_sec1  = (SELECT id FROM users WHERE email='secretary1@gmail.com');
SET @u_sec2  = (SELECT id FROM users WHERE email='secretary2@gmail.com');

-- Broadcast from admin
INSERT INTO messages (sender_id, recipient_id, recipient_role, subject, body, is_broadcast, created_at) VALUES
(@u_admin, NULL, 'all', 'Welcome to EduFlow 2025-2026',
 'Dear staff,\n\nWelcome to the new academic year! The EduFlow system is now live. Please update your profile and verify your class assignments.\n\nBest regards,\nPrincipal Katz',
 TRUE, '2025-09-01 08:00:00'),

(@u_admin, NULL, 'all', 'Staff Meeting — Monday June 15',
 'A mandatory staff meeting will be held on Monday June 15 at 3:30pm in the main hall. Attendance is required.',
 TRUE, '2026-06-10 09:00:00'),

(@u_admin, NULL, 'all_teachers', 'Grade Submission Reminder',
 'All end-of-year grades must be submitted by June 25. Please make sure all exams are graded and entered into the system.',
 TRUE, '2026-06-05 10:00:00'),

(@u_admin, NULL, 'all_secretaries', 'Year-End Administrative Tasks',
 'Please prepare the class report templates for year-end archiving. All documents should be ready by June 28.',
 TRUE, '2026-06-08 11:00:00');

-- Secretary to admin
INSERT INTO messages (sender_id, recipient_id, recipient_role, subject, body, is_broadcast, created_at) VALUES
(@u_sec1, @u_admin, NULL, 'Print Budget Question',
 'Good morning,\n\nWe have received 15 print requests this week and the paper supply is running low. Can we approve an emergency purchase?\n\nThank you,\nSarah',
 FALSE, '2026-06-09 08:30:00'),

(@u_sec2, @u_admin, NULL, 'New Student Registration',
 'Hi,\n\nWe have 3 new student registration requests pending approval. Please review at your earliest convenience.\n\nRivka',
 FALSE, '2026-06-07 14:00:00');

-- Teachers to secretary
INSERT INTO messages (sender_id, recipient_id, recipient_role, subject, body, is_broadcast, created_at) VALUES
(@t_avi, @u_sec1, NULL, 'Print Request Follow-up',
 'Hi Sarah,\n\nJust checking on the math quiz print request I submitted yesterday. The test is tomorrow morning and I need 81 copies.\n\nThanks,\nAvi',
 FALSE, '2026-06-09 16:00:00'),

(@t_yoni, @u_sec1, NULL, 'Urgent: Calculus Midterm Copies',
 'Hi,\n\nI need the calculus midterm printed urgently for tomorrow (June 12). 79 copies for 11th grade. Please prioritize.\n\nYoni Shapiro',
 FALSE, '2026-06-10 07:45:00'),

(@t_noa, @u_sec2, NULL, 'Biology Worksheet',
 'Hi Rivka,\n\nCould you please make 79 copies of the biology worksheet I uploaded? Needed for Monday June 13.\n\nThank you,\nNoa',
 FALSE, '2026-06-10 09:00:00'),

(@t_liron, @u_sec1, NULL, 'Class List Update',
 'Hi Sarah,\n\nStudent Zohar Cohen in 12A has transferred to another school. Please update the records accordingly.\n\nLiron Goldstein',
 FALSE, '2026-06-08 13:00:00'),

(@t_gal, @u_sec1, NULL, 'Computer Lab Booking',
 'Hi,\n\nI need to book the computer lab for the data structures final on June 10 from 1-3pm for 78 students (12A, 12B, 12C combined). Is this possible?\n\nGal Stern',
 FALSE, '2026-06-06 11:00:00');

-- Secretary reply to teacher
INSERT INTO messages (sender_id, recipient_id, recipient_role, subject, body, is_broadcast, created_at) VALUES
(@u_sec1, @t_avi, NULL, 'RE: Print Request Follow-up',
 'Hi Avi,\n\nYour print request is in progress and will be ready by 7:30am tomorrow. You can collect it from the print room.\n\nSarah',
 FALSE, '2026-06-09 16:30:00'),

(@u_sec1, @t_yoni, NULL, 'RE: Urgent: Calculus Midterm Copies',
 'Hi Yoni,\n\nUnderstood — I will handle this first thing tomorrow morning. The copies will be on your desk by 8am.\n\nSarah',
 FALSE, '2026-06-10 08:00:00'),

(@u_sec1, @t_gal, NULL, 'RE: Computer Lab Booking',
 'Hi Gal,\n\nThe computer lab is available on June 10 from 1-3pm. I have reserved it for you. You will need to split the 3 classes into two sessions or use both rooms A and B.\n\nSarah',
 FALSE, '2026-06-06 12:00:00');

-- Teacher to teacher
INSERT INTO messages (sender_id, recipient_id, recipient_role, subject, body, is_broadcast, created_at) VALUES
(@t_avi, @t_yoni, NULL, 'Math Curriculum Alignment',
 'Hi Yoni,\n\nCan we meet this week to align the 11th grade math curriculum with the Bagrut requirements? I think there are some topics we should coordinate on.\n\nAvi',
 FALSE, '2026-06-05 14:00:00'),

(@t_sarah, @t_noa, NULL, 'Shared Lab Resources',
 'Hi Noa,\n\nI have some great lab resources for the genetics unit that I think you could also use for 11th grade. Want to share materials?\n\nSarah Peretz',
 FALSE, '2026-06-04 10:30:00');

-- ── Mark some messages as read ────────────────────────────────
INSERT INTO message_reads (user_id, message_id)
SELECT @u_sec1, id FROM messages WHERE recipient_role IN ('all','all_secretaries');

INSERT INTO message_reads (user_id, message_id)
SELECT @u_sec2, id FROM messages WHERE recipient_role IN ('all','all_secretaries');

INSERT INTO message_reads (user_id, message_id)
SELECT @u_admin, id FROM messages WHERE sender_id = @u_sec1 AND recipient_id = @u_admin;

INSERT INTO message_reads (user_id, message_id)
SELECT @t_avi, id FROM messages WHERE recipient_id = @t_avi;

INSERT INTO message_reads (user_id, message_id)
SELECT @t_yoni, id FROM messages WHERE recipient_id = @t_yoni;

INSERT INTO message_reads (user_id, message_id)
SELECT @t_gal, id FROM messages WHERE recipient_id = @t_gal;

-- ── Notifications ─────────────────────────────────────────────
INSERT INTO notifications (user_id, role_target, type, title, content, data, is_read, created_at) VALUES
(NULL, 'all', 'message', 'New broadcast: Welcome to EduFlow 2025-2026',
 'Dear staff, Welcome to the new academic year! The EduFlow system is now live.',
 '{"entity_type":"message"}', TRUE, '2025-09-01 08:00:00'),

(NULL, 'all', 'message', 'Staff Meeting — Monday June 15',
 'A mandatory staff meeting will be held on Monday June 15 at 3:30pm in the main hall.',
 '{"entity_type":"message"}', FALSE, '2026-06-10 09:00:00'),

(NULL, 'all_teachers', 'message', 'Grade Submission Reminder',
 'All end-of-year grades must be submitted by June 25.',
 '{"entity_type":"message"}', FALSE, '2026-06-05 10:00:00'),

(@u_sec1, NULL, 'message', 'Avi Cohen: Print Request Follow-up',
 'Hi Sarah, Just checking on the math quiz print request I submitted yesterday.',
 '{"entity_type":"message"}', TRUE, '2026-06-09 16:00:00'),

(@u_sec1, NULL, 'message', 'Yoni Shapiro: Urgent Calculus Midterm',
 'I need the calculus midterm printed urgently for tomorrow.',
 '{"entity_type":"message"}', FALSE, '2026-06-10 07:45:00'),

(@u_admin, NULL, 'message', 'Sarah Cohen: Print Budget Question',
 'The paper supply is running low. Can we approve an emergency purchase?',
 '{"entity_type":"message"}', FALSE, '2026-06-09 08:30:00'),

(@u_admin, NULL, 'message', 'Rivka Ben-David: New Student Registration',
 '3 new student registration requests pending approval.',
 '{"entity_type":"message"}', FALSE, '2026-06-07 14:00:00'),

(@t_avi, NULL, 'message', 'Sarah Cohen: Print ready for tomorrow',
 'Your print request is in progress and will be ready by 7:30am tomorrow.',
 '{"entity_type":"message"}', TRUE, '2026-06-09 16:30:00'),

(@t_yoni, NULL, 'message', 'Sarah Cohen: Calculus copies confirmed',
 'The copies will be on your desk by 8am.',
 '{"entity_type":"message"}', FALSE, '2026-06-10 08:00:00'),

(@t_yoni, NULL, 'message', 'Avi Cohen: Math Curriculum Alignment',
 'Can we meet this week to align the 11th grade math curriculum?',
 '{"entity_type":"message"}', FALSE, '2026-06-05 14:00:00'),

(@t_noa, NULL, 'message', 'Sarah Peretz: Shared Lab Resources',
 'I have some great lab resources for the genetics unit.',
 '{"entity_type":"message"}', FALSE, '2026-06-04 10:30:00');

SELECT CONCAT(
  'Seed complete! ',
  (SELECT COUNT(*) FROM users), ' users, ',
  (SELECT COUNT(*) FROM classes), ' classes, ',
  (SELECT COUNT(*) FROM students), ' students, ',
  (SELECT COUNT(*) FROM grades), ' grades, ',
  (SELECT COUNT(*) FROM messages), ' messages.'
) AS summary;
