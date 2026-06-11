-- Safe migration: apply all missing schema changes
-- Run this once against the eduflow database.
-- All statements use IF NOT EXISTS / IF column not exists guards.
USE eduflow;

-- 1. Add is_homeroom column to users (from migrate_homeroom.sql)
SET @col := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'is_homeroom'
);
SET @sql := IF(@col = 0,
  'ALTER TABLE users ADD COLUMN is_homeroom BOOLEAN DEFAULT FALSE AFTER phone2',
  'SELECT "is_homeroom already exists" AS info'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 2. Drop legacy homeroom_class_id FK + column if they still exist (from migrate_homeroom_v2.sql)
SET @fk := (
  SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users'
    AND CONSTRAINT_NAME = 'fk_homeroom_class' AND CONSTRAINT_TYPE = 'FOREIGN KEY'
);
SET @sql := IF(@fk > 0,
  'ALTER TABLE users DROP FOREIGN KEY fk_homeroom_class',
  'SELECT "fk_homeroom_class FK does not exist" AS info'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @hcol := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'homeroom_class_id'
);
SET @sql := IF(@hcol > 0,
  'ALTER TABLE users DROP COLUMN homeroom_class_id',
  'SELECT "homeroom_class_id already removed" AS info'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 3. Create teacher_homeroom_classes table (from migrate_homeroom_v2.sql)
CREATE TABLE IF NOT EXISTS teacher_homeroom_classes (
  teacher_id INT NOT NULL,
  class_id   INT NOT NULL,
  PRIMARY KEY (teacher_id, class_id),
  FOREIGN KEY (teacher_id) REFERENCES users(id)   ON DELETE CASCADE,
  FOREIGN KEY (class_id)   REFERENCES classes(id) ON DELETE CASCADE
);

-- 4. Add attachment columns to messages (from migrate_message_attachment.sql)
SET @ap := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'messages' AND COLUMN_NAME = 'attachment_path'
);
SET @sql := IF(@ap = 0,
  'ALTER TABLE messages ADD COLUMN attachment_path VARCHAR(255) DEFAULT NULL, ADD COLUMN attachment_name VARCHAR(255) DEFAULT NULL',
  'SELECT "attachment columns already exist" AS info'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SELECT 'Migration complete.' AS result;
