USE eduflow;

CREATE TABLE IF NOT EXISTS quotes (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  role       ENUM('admin', 'teacher', 'secretary') NOT NULL,
  text       TEXT NOT NULL,
  is_active  BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quotes_role ON quotes(role, is_active);

INSERT INTO quotes (role, text) VALUES
-- admin
('admin', 'Leadership is not about rank or title — it is about influence, impact, and the inspiration you spark in others.'),
('admin', 'Education is not the filling of a vessel, but the kindling of a flame.'),
('admin', 'A great principal builds people, not just systems.'),
('admin', 'The best way to predict the future of your institution is to create it together with your team.'),
('admin', 'A leader''s success is measured by the number of people they grow, not the number of people who work under them.'),
('admin', 'Vision without action is merely a dream. Action without vision is just passing time. Vision combined with action can change reality.'),
('admin', 'Organizational culture is not written on the walls — it is rebuilt every day through respect, listening, and personal example.'),
('admin', 'A principal''s role is not to prevent storms, but to teach the team to sail together even when the sea is rough.'),
-- teacher
('teacher', 'Every child needs at least one adult who believes in them unconditionally.'),
('teacher', 'A mediocre teacher tells. A good teacher explains. A great teacher demonstrates. An exceptional teacher inspires.'),
('teacher', 'Education is the means by which we help a person become everything they are capable of being.'),
('teacher', 'The influence of a great teacher echoes forever — you can never know where it ends.'),
('teacher', 'Teaching is not my profession — teaching is my purpose.'),
('teacher', 'The words you say to a student today become the inner voice they carry tomorrow.'),
('teacher', 'Never give up on a student — you never know what success story they are about to write.'),
('teacher', 'Meaningful teaching begins the moment a student feels truly seen, even before their knowledge is tested.'),
('teacher', 'Patience is the root of all pedagogical success; the seeds you plant today may bloom only years from now.'),
-- secretary
('secretary', 'A smile and a kind word are the keys that open every door in a school.'),
('secretary', 'Order and organisation are the foundation on which great educational work grows.'),
('secretary', 'Courtesy in service is not just a duty — it is the way we make the workplace better for everyone.'),
('secretary', 'The small details are the ones that create the big, successful picture.'),
('secretary', 'A strong office team is the backbone that keeps the entire educational system standing tall.'),
('secretary', 'Behind every successful school stands an office team that handles the small details with professionalism and calm.'),
('secretary', 'The way you answer the phone or greet someone at the desk is the showcase of the entire institution.'),
('secretary', 'Efficiency and order in the office create the peace of mind that lets teachers teach and leaders lead.'),
('secretary', 'Where there is order, there is room to grow.');
