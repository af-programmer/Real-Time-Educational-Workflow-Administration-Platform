-- EduFlow Database Schema
-- MySQL 8.0+

CREATE DATABASE IF NOT EXISTS eduflow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE eduflow;

-- ============================================================
-- CODE TABLES (lookup / reference tables)
-- ============================================================
CREATE TABLE IF NOT EXISTS roles (
  id   INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS grade_levels (
  id    INT PRIMARY KEY AUTO_INCREMENT,
  code  VARCHAR(10)  NOT NULL UNIQUE,   -- e.g. '10'
  label VARCHAR(50)  NOT NULL           -- e.g. '10th Grade'
);

CREATE TABLE IF NOT EXISTS print_priorities (
  id    INT PRIMARY KEY AUTO_INCREMENT,
  code  VARCHAR(20) NOT NULL UNIQUE,    -- 'normal' | 'important' | 'urgent'
  label VARCHAR(50) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS print_statuses (
  id    INT PRIMARY KEY AUTO_INCREMENT,
  code  VARCHAR(20) NOT NULL UNIQUE,    -- 'pending' | 'in_progress' | 'printed' | 'completed'
  label VARCHAR(50) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS exam_types (
  id    INT PRIMARY KEY AUTO_INCREMENT,
  code  VARCHAR(30) NOT NULL UNIQUE,    -- 'test' | 'quiz' | 'midterm' | 'final' | 'homework'
  label VARCHAR(50) NOT NULL
);

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id           INT PRIMARY KEY AUTO_INCREMENT,
  name         VARCHAR(100) NOT NULL,
  email        VARCHAR(150) NOT NULL UNIQUE,
  role_id      INT NOT NULL,
  is_active    BOOLEAN DEFAULT TRUE,
  is_suspended BOOLEAN DEFAULT FALSE,
  avatar_url   VARCHAR(255) DEFAULT NULL,
  phone        VARCHAR(20)  DEFAULT NULL,
  phone2       VARCHAR(20)  DEFAULT NULL,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
);

-- Passwords stored separately for security isolation
CREATE TABLE IF NOT EXISTS user_credentials (
  user_id       INT PRIMARY KEY,
  password_hash VARCHAR(255) NOT NULL,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- SUBJECTS
-- ============================================================
CREATE TABLE IF NOT EXISTS subjects (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  name        VARCHAR(100) NOT NULL UNIQUE,
  description TEXT DEFAULT NULL,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- CLASSES
-- ============================================================
CREATE TABLE IF NOT EXISTS classes (
  id               INT PRIMARY KEY AUTO_INCREMENT,
  name             VARCHAR(50) NOT NULL UNIQUE,
  student_count    INT NOT NULL DEFAULT 0,    -- current enrolled student count
  grade_level_id   INT NOT NULL,
  academic_year    VARCHAR(9) NOT NULL,        -- enforced format YYYY-YYYY via CHECK
  is_active        BOOLEAN DEFAULT TRUE,
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (grade_level_id) REFERENCES grade_levels(id) ON DELETE RESTRICT,
  CONSTRAINT chk_academic_year CHECK (academic_year REGEXP '^[0-9]{4}-[0-9]{4}$')
);

-- ============================================================
-- STUDENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS students (
  id              INT PRIMARY KEY AUTO_INCREMENT,
  name            VARCHAR(100) NOT NULL,
  class_id        INT NOT NULL,
  student_number  VARCHAR(20) UNIQUE DEFAULT NULL,  -- school-assigned ID (business key)
  date_of_birth   DATE DEFAULT NULL,
  phone_father    VARCHAR(20) DEFAULT NULL,
  phone_mother    VARCHAR(20) DEFAULT NULL,
  phone_home      VARCHAR(20) DEFAULT NULL,
  parent_email    VARCHAR(150) DEFAULT NULL,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE RESTRICT,
  CONSTRAINT chk_student_phone CHECK (
    phone_father IS NOT NULL OR phone_mother IS NOT NULL OR phone_home IS NOT NULL
  )
);

-- ============================================================
-- TEACHER → CLASSES (Many-to-Many)
-- ============================================================
CREATE TABLE IF NOT EXISTS teacher_classes (
  teacher_id  INT NOT NULL,
  class_id    INT NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (teacher_id, class_id),
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (class_id)   REFERENCES classes(id) ON DELETE CASCADE
);

-- ============================================================
-- TEACHER → SUBJECTS (Many-to-Many)
-- ============================================================
CREATE TABLE IF NOT EXISTS teacher_subjects (
  teacher_id  INT NOT NULL,
  subject_id  INT NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (teacher_id, subject_id),
  FOREIGN KEY (teacher_id) REFERENCES users(id)     ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES subjects(id)  ON DELETE CASCADE
);

-- ============================================================
-- TEACHER LIBRARY
-- ============================================================
CREATE TABLE IF NOT EXISTS teacher_library (
  id            INT PRIMARY KEY AUTO_INCREMENT,
  teacher_id    INT NOT NULL,
  subject_id    INT NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  stored_name   VARCHAR(255) NOT NULL,
  file_size     INT NOT NULL,
  mime_type     VARCHAR(100) NOT NULL,
  description   VARCHAR(255) DEFAULT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE RESTRICT
);

-- ============================================================
-- PRINT REQUESTS
-- ============================================================
CREATE TABLE IF NOT EXISTS print_requests (
  id           INT PRIMARY KEY AUTO_INCREMENT,
  teacher_id   INT NOT NULL,
  subject_id   INT NOT NULL,
  priority_id  INT NOT NULL,
  status_id    INT NOT NULL,
  lesson_date  DATE NOT NULL,
  lesson_time  TIME DEFAULT NULL,
  total_copies INT NOT NULL DEFAULT 0,
  notes        TEXT DEFAULT NULL,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id)  REFERENCES users(id)            ON DELETE CASCADE,
  FOREIGN KEY (subject_id)  REFERENCES subjects(id)         ON DELETE RESTRICT,
  FOREIGN KEY (priority_id) REFERENCES print_priorities(id) ON DELETE RESTRICT,
  FOREIGN KEY (status_id)   REFERENCES print_statuses(id)   ON DELETE RESTRICT
);

-- ============================================================
-- PRINT REQUEST → CLASSES (Many-to-Many with copies per class)
-- copies_count comes from classes.student_count at request time
-- ============================================================
CREATE TABLE IF NOT EXISTS print_request_classes (
  print_request_id INT NOT NULL,
  class_id         INT NOT NULL,
  copies_count     INT NOT NULL DEFAULT 0,
  PRIMARY KEY (print_request_id, class_id),
  FOREIGN KEY (print_request_id) REFERENCES print_requests(id) ON DELETE CASCADE,
  FOREIGN KEY (class_id)         REFERENCES classes(id)         ON DELETE RESTRICT
);

-- ============================================================
-- PRINT FILES
-- ============================================================
CREATE TABLE IF NOT EXISTS print_files (
  id               INT PRIMARY KEY AUTO_INCREMENT,
  print_request_id INT NOT NULL,
  original_name    VARCHAR(255) NOT NULL,
  stored_name      VARCHAR(255) NOT NULL,
  file_path        VARCHAR(500) NOT NULL,
  file_size        INT NOT NULL,
  mime_type        VARCHAR(100) NOT NULL,
  uploaded_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (print_request_id) REFERENCES print_requests(id) ON DELETE CASCADE
);

-- ============================================================
-- GRADES
-- ============================================================
CREATE TABLE IF NOT EXISTS grades (
  id           INT PRIMARY KEY AUTO_INCREMENT,
  student_id   INT NOT NULL,
  subject_id   INT NOT NULL,
  teacher_id   INT NOT NULL,
  exam_type_id INT NOT NULL,
  grade        DECIMAL(5,2) NOT NULL,
  date         DATE NOT NULL,
  notes        TEXT DEFAULT NULL,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id)   REFERENCES students(id)   ON DELETE CASCADE,
  FOREIGN KEY (subject_id)   REFERENCES subjects(id)   ON DELETE RESTRICT,
  FOREIGN KEY (teacher_id)   REFERENCES users(id)      ON DELETE RESTRICT,
  FOREIGN KEY (exam_type_id) REFERENCES exam_types(id) ON DELETE RESTRICT
);

-- ============================================================
-- GRADE COMMENTS
-- teacher_id is NOT stored here — derive from grades.teacher_id
-- ============================================================
CREATE TABLE IF NOT EXISTS grade_comments (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  grade_id   INT NOT NULL,
  comment    TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (grade_id) REFERENCES grades(id) ON DELETE CASCADE
);

-- ============================================================
-- MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS messages (
  id                INT PRIMARY KEY AUTO_INCREMENT,
  sender_id         INT NOT NULL,
  recipient_id      INT DEFAULT NULL,
  recipient_role    VARCHAR(50) DEFAULT NULL,
  subject           VARCHAR(255) DEFAULT NULL,
  body              TEXT NOT NULL,
  is_broadcast      BOOLEAN DEFAULT FALSE,
  parent_message_id INT DEFAULT NULL,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id)         REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (recipient_id)      REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (parent_message_id) REFERENCES messages(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS message_reads (
  user_id    INT NOT NULL,
  message_id INT NOT NULL,
  read_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, message_id),
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS message_deletes (
  user_id    INT NOT NULL,
  message_id INT NOT NULL,
  deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, message_id),
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
);

-- ============================================================
-- NOTIFICATIONS (generic, extensible)
-- user_id NULL = targets a role (use role_target)
-- data JSON = extra payload per notification type
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  user_id    INT NULL,
  role_target VARCHAR(50) DEFAULT NULL,
  type       VARCHAR(50) NOT NULL,
  title      VARCHAR(255) NOT NULL,
  content    TEXT,
  data       JSON NULL,
  is_read    BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notification_reads (
  user_id         INT NOT NULL,
  notification_id INT NOT NULL,
  read_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, notification_id),
  FOREIGN KEY (user_id)         REFERENCES users(id)          ON DELETE CASCADE,
  FOREIGN KEY (notification_id) REFERENCES notifications(id)  ON DELETE CASCADE
);

-- ============================================================
-- AUDIT LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  user_id    INT DEFAULT NULL,
  action     VARCHAR(100) NOT NULL,
  entity     VARCHAR(50)  NOT NULL,
  entity_id  INT DEFAULT NULL,
  old_values JSON DEFAULT NULL,
  new_values JSON DEFAULT NULL,
  ip_address VARCHAR(45) DEFAULT NULL,
  user_agent TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================
-- INDEXES
-- ============================================================
-- users
CREATE INDEX idx_users_email     ON users(email);
CREATE INDEX idx_users_role      ON users(role_id);

-- print_requests — high-traffic filters
CREATE INDEX idx_pr_teacher      ON print_requests(teacher_id);
CREATE INDEX idx_pr_status       ON print_requests(status_id);
CREATE INDEX idx_pr_priority     ON print_requests(priority_id);
CREATE INDEX idx_pr_date         ON print_requests(lesson_date);

-- grades — always filtered by teacher + student
CREATE INDEX idx_grades_student  ON grades(student_id);
CREATE INDEX idx_grades_subject  ON grades(subject_id);
CREATE INDEX idx_grades_teacher  ON grades(teacher_id);

-- messages — inbox queries filter by recipient
CREATE INDEX idx_msg_recipient   ON messages(recipient_id);
CREATE INDEX idx_msg_sender      ON messages(sender_id);

-- notifications — per-user bell icon query
CREATE INDEX idx_notif_user      ON notifications(user_id);

-- students — always fetched by class
CREATE INDEX idx_students_class  ON students(class_id);

-- library — always fetched by teacher
CREATE INDEX idx_library_teacher ON teacher_library(teacher_id);

-- audit_logs — admin queries by entity or user
CREATE INDEX idx_audit_user      ON audit_logs(user_id);
CREATE INDEX idx_audit_entity    ON audit_logs(entity, entity_id);

-- NOTE: is_read (notifications/messages) intentionally NOT indexed —
-- boolean columns with ~50% distribution offer no benefit to MySQL optimizer.
