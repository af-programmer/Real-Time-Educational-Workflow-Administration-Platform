-- EduFlow Schema Migration (consolidated)
-- Safe to run against any EduFlow database version — all statements are idempotent.
-- Standard MySQL compatible (no MariaDB-only syntax).
-- Run: mysql -u <user> -p eduflow < database/migrate.sql
USE eduflow;

-- ── Helper: add a column only if it does not already exist ────────────
DROP PROCEDURE IF EXISTS _ac;
DELIMITER $$
CREATE PROCEDURE _ac(IN p_tbl VARCHAR(64), IN p_col VARCHAR(64), IN p_def TEXT)
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME   = p_tbl
      AND COLUMN_NAME  = p_col
  ) THEN
    SET @_s = CONCAT('ALTER TABLE `', p_tbl, '` ADD COLUMN ', p_def);
    PREPARE _st FROM @_s;
    EXECUTE _st;
    DEALLOCATE PREPARE _st;
  END IF;
END $$
DELIMITER ;

-- ── users ─────────────────────────────────────────────────────────────────────
CALL _ac('users', 'is_homeroom', 'is_homeroom TINYINT(1)   NOT NULL DEFAULT 0');
CALL _ac('users', 'phone2',      'phone2      VARCHAR(20)  DEFAULT NULL');
CALL _ac('users', 'avatar_url',  'avatar_url  VARCHAR(255) DEFAULT NULL');

-- Drop legacy homeroom FK + column if still present from old schema version
SET @fk := (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users'
    AND CONSTRAINT_NAME = 'fk_homeroom_class' AND CONSTRAINT_TYPE = 'FOREIGN KEY');
SET @sql := IF(@fk > 0, 'ALTER TABLE users DROP FOREIGN KEY fk_homeroom_class', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'homeroom_class_id');
SET @sql := IF(@col > 0, 'ALTER TABLE users DROP COLUMN homeroom_class_id', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ── students ──────────────────────────────────────────────────────────────────
CALL _ac('students', 'id_number',      'id_number      VARCHAR(20)  DEFAULT NULL');
CALL _ac('students', 'student_number', 'student_number VARCHAR(20)  DEFAULT NULL');
CALL _ac('students', 'phone_father',   'phone_father   VARCHAR(20)  DEFAULT NULL');
CALL _ac('students', 'phone_mother',   'phone_mother   VARCHAR(20)  DEFAULT NULL');
CALL _ac('students', 'phone_home',     'phone_home     VARCHAR(20)  DEFAULT NULL');
CALL _ac('students', 'parent_email',   'parent_email   VARCHAR(100) DEFAULT NULL');
CALL _ac('students', 'date_of_birth',  'date_of_birth  DATE         DEFAULT NULL');
CALL _ac('students', 'is_active',      'is_active      TINYINT(1)   NOT NULL DEFAULT 1');

-- ── messages ──────────────────────────────────────────────────────────────────
CALL _ac('messages', 'attachment_path', 'attachment_path VARCHAR(255) DEFAULT NULL');
CALL _ac('messages', 'attachment_name', 'attachment_name VARCHAR(255) DEFAULT NULL');
CALL _ac('messages', 'is_broadcast',    'is_broadcast    TINYINT(1)   NOT NULL DEFAULT 0');
CALL _ac('messages', 'recipient_role',  'recipient_role  VARCHAR(50)  DEFAULT NULL');

-- ── teacher_library ───────────────────────────────────────────────────────────
-- Allow files without a subject ("Others" category)
SET @nullable := (SELECT IS_NULLABLE FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'teacher_library' AND COLUMN_NAME = 'subject_id');
SET @sql := IF(@nullable = 'NO', 'ALTER TABLE teacher_library MODIFY subject_id INT NULL', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ── grades ────────────────────────────────────────────────────────────────────
-- Allow teachers to be deleted without losing grade history (SET NULL instead of RESTRICT)
ALTER TABLE grades MODIFY COLUMN teacher_id INT NULL;

SET @_fk := (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'grades'
    AND CONSTRAINT_NAME = 'grades_ibfk_3' AND CONSTRAINT_TYPE = 'FOREIGN KEY');
SET @_sql := IF(@_fk > 0, 'ALTER TABLE grades DROP FOREIGN KEY grades_ibfk_3', 'SELECT 1');
PREPARE _st FROM @_sql; EXECUTE _st; DEALLOCATE PREPARE _st;

ALTER TABLE grades
  ADD CONSTRAINT grades_ibfk_3
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE SET NULL;

-- ── teacher_homeroom_classes ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS teacher_homeroom_classes (
  teacher_id INT NOT NULL,
  class_id   INT NOT NULL,
  PRIMARY KEY (teacher_id, class_id),
  FOREIGN KEY (teacher_id) REFERENCES users(id)   ON DELETE CASCADE,
  FOREIGN KEY (class_id)   REFERENCES classes(id) ON DELETE CASCADE
);

-- ── quotes ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quotes (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  role       ENUM('admin', 'teacher', 'secretary') NOT NULL,
  text       TEXT NOT NULL,
  is_active  BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SET @_idx := (SELECT COUNT(*) FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'quotes' AND INDEX_NAME = 'idx_quotes_role');
SET @_sql := IF(@_idx = 0, 'CREATE INDEX idx_quotes_role ON quotes(role, is_active)', 'SELECT 1');
PREPARE _st FROM @_sql; EXECUTE _st; DEALLOCATE PREPARE _st;

INSERT IGNORE INTO quotes (role, text) VALUES
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
  ('secretary', 'Where there is order, there is room to grow.');

-- Cleanup helper procedure
DROP PROCEDURE IF EXISTS _ac;

SELECT 'Migration complete.' AS result;
