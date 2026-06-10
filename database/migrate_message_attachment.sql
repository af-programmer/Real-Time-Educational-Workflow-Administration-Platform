USE eduflow;
ALTER TABLE messages
  ADD COLUMN attachment_path VARCHAR(255) DEFAULT NULL,
  ADD COLUMN attachment_name VARCHAR(255) DEFAULT NULL;
