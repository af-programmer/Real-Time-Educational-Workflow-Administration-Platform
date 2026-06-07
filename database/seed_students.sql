USE eduflow;

-- Clear existing students to avoid duplicates
DELETE FROM students;
ALTER TABLE students AUTO_INCREMENT = 1;

-- ============================================================
-- CLASS A1 — 10th grade (IDs 1–28, student_number 1–28)
-- ============================================================
SET @a1 = (SELECT id FROM classes WHERE name = 'A1');

INSERT INTO students (id, name, class_id, student_number, date_of_birth, parent_phone, parent_email) VALUES
(1,  'Alice Johnson',    @a1, '1',  '2008-03-12', '050-1111001', 'parent1@gmail.com'),
(2,  'Bob Williams',     @a1, '2',  '2008-07-24', '050-1111002', 'parent2@gmail.com'),
(3,  'Carol Davis',      @a1, '3',  '2008-01-05', '050-1111003', 'parent3@gmail.com'),
(4,  'Daniel Miller',    @a1, '4',  '2008-09-18', '050-1111004', 'parent4@gmail.com'),
(5,  'Eva Wilson',       @a1, '5',  '2008-11-30', '050-1111005', 'parent5@gmail.com'),
(6,  'Frank Moore',      @a1, '6',  '2008-04-22', '050-1111006', 'parent6@gmail.com'),
(7,  'Grace Taylor',     @a1, '7',  '2008-06-14', '050-1111007', 'parent7@gmail.com'),
(8,  'Henry Anderson',   @a1, '8',  '2008-02-09', '050-1111008', 'parent8@gmail.com'),
(9,  'Iris Thomas',      @a1, '9',  '2008-08-27', '050-1111009', 'parent9@gmail.com'),
(10, 'Jack Jackson',     @a1, '10', '2008-12-03', '050-1111010', 'parent10@gmail.com'),
(11, 'Karen White',      @a1, '11', '2008-05-16', '050-1111011', 'parent11@gmail.com'),
(12, 'Liam Harris',      @a1, '12', '2008-10-08', '050-1111012', 'parent12@gmail.com'),
(13, 'Mia Martin',       @a1, '13', '2008-03-29', '050-1111013', 'parent13@gmail.com'),
(14, 'Noah Garcia',      @a1, '14', '2008-07-11', '050-1111014', 'parent14@gmail.com'),
(15, 'Olivia Martinez',  @a1, '15', '2008-01-20', '050-1111015', 'parent15@gmail.com'),
(16, 'Paul Robinson',    @a1, '16', '2008-09-04', '050-1111016', 'parent16@gmail.com'),
(17, 'Quinn Clark',      @a1, '17', '2008-11-17', '050-1111017', 'parent17@gmail.com'),
(18, 'Rachel Rodriguez', @a1, '18', '2008-04-01', '050-1111018', 'parent18@gmail.com'),
(19, 'Sam Lewis',        @a1, '19', '2008-06-23', '050-1111019', 'parent19@gmail.com'),
(20, 'Tina Lee',         @a1, '20', '2008-02-15', '050-1111020', 'parent20@gmail.com'),
(21, 'Uma Walker',       @a1, '21', '2008-08-07', '050-1111021', 'parent21@gmail.com'),
(22, 'Victor Hall',      @a1, '22', '2008-12-19', '050-1111022', 'parent22@gmail.com'),
(23, 'Wendy Allen',      @a1, '23', '2008-05-31', '050-1111023', 'parent23@gmail.com'),
(24, 'Xander Young',     @a1, '24', '2008-10-13', '050-1111024', 'parent24@gmail.com'),
(25, 'Yara Hernandez',   @a1, '25', '2008-03-06', '050-1111025', 'parent25@gmail.com'),
(26, 'Zoe King',         @a1, '26', '2008-07-28', '050-1111026', 'parent26@gmail.com'),
(27, 'Aaron Wright',     @a1, '27', '2008-01-10', '050-1111027', 'parent27@gmail.com'),
(28, 'Bella Scott',      @a1, '28', '2008-09-22', '050-1111028', 'parent28@gmail.com');

-- ============================================================
-- CLASS A2 — 10th grade (IDs 29–59, student_number 29–59)
-- ============================================================
SET @a2 = (SELECT id FROM classes WHERE name = 'A2');

INSERT INTO students (id, name, class_id, student_number, date_of_birth, parent_phone, parent_email) VALUES
(29, 'Carlos Green',     @a2, '29', '2008-04-14', '050-2222001', 'parent29@gmail.com'),
(30, 'Diana Adams',      @a2, '30', '2008-06-26', '050-2222002', 'parent30@gmail.com'),
(31, 'Ethan Baker',      @a2, '31', '2008-02-18', '050-2222003', 'parent31@gmail.com'),
(32, 'Fiona Nelson',     @a2, '32', '2008-08-09', '050-2222004', 'parent32@gmail.com'),
(33, 'George Carter',    @a2, '33', '2008-12-21', '050-2222005', 'parent33@gmail.com'),
(34, 'Hannah Mitchell',  @a2, '34', '2008-05-03', '050-2222006', 'parent34@gmail.com'),
(35, 'Ivan Perez',       @a2, '35', '2008-10-15', '050-2222007', 'parent35@gmail.com'),
(36, 'Julia Roberts',    @a2, '36', '2008-03-27', '050-2222008', 'parent36@gmail.com'),
(37, 'Kevin Turner',     @a2, '37', '2008-07-08', '050-2222009', 'parent37@gmail.com'),
(38, 'Laura Phillips',   @a2, '38', '2008-01-31', '050-2222010', 'parent38@gmail.com'),
(39, 'Mark Campbell',    @a2, '39', '2008-09-12', '050-2222011', 'parent39@gmail.com'),
(40, 'Nina Parker',      @a2, '40', '2008-11-24', '050-2222012', 'parent40@gmail.com'),
(41, 'Oscar Evans',      @a2, '41', '2008-04-06', '050-2222013', 'parent41@gmail.com'),
(42, 'Penny Edwards',    @a2, '42', '2008-06-18', '050-2222014', 'parent42@gmail.com'),
(43, 'Quincy Collins',   @a2, '43', '2008-02-01', '050-2222015', 'parent43@gmail.com'),
(44, 'Rosa Stewart',     @a2, '44', '2008-08-13', '050-2222016', 'parent44@gmail.com'),
(45, 'Steve Sanchez',    @a2, '45', '2008-12-25', '050-2222017', 'parent45@gmail.com'),
(46, 'Tara Morris',      @a2, '46', '2008-05-07', '050-2222018', 'parent46@gmail.com'),
(47, 'Umar Rogers',      @a2, '47', '2008-10-19', '050-2222019', 'parent47@gmail.com'),
(48, 'Vera Reed',        @a2, '48', '2008-03-31', '050-2222020', 'parent48@gmail.com'),
(49, 'Walter Cook',      @a2, '49', '2008-07-22', '050-2222021', 'parent49@gmail.com'),
(50, 'Xenia Morgan',     @a2, '50', '2008-01-14', '050-2222022', 'parent50@gmail.com'),
(51, 'Yasmin Bell',      @a2, '51', '2008-09-26', '050-2222023', 'parent51@gmail.com'),
(52, 'Zack Murphy',      @a2, '52', '2008-11-07', '050-2222024', 'parent52@gmail.com'),
(53, 'Amy Bailey',       @a2, '53', '2008-04-19', '050-2222025', 'parent53@gmail.com'),
(54, 'Brian Rivera',     @a2, '54', '2008-06-01', '050-2222026', 'parent54@gmail.com'),
(55, 'Cindy Cooper',     @a2, '55', '2008-02-23', '050-2222027', 'parent55@gmail.com'),
(56, 'Derek Richardson', @a2, '56', '2008-08-04', '050-2222028', 'parent56@gmail.com'),
(57, 'Ellie Cox',        @a2, '57', '2008-12-16', '050-2222029', 'parent57@gmail.com'),
(58, 'Felix Howard',     @a2, '58', '2008-05-28', '050-2222030', 'parent58@gmail.com'),
(59, 'Gina Ward',        @a2, '59', '2008-10-10', '050-2222031', 'parent59@gmail.com');

-- ============================================================
-- CLASS B1 — 11th grade (IDs 60–84, student_number 60–84)
-- ============================================================
SET @b1 = (SELECT id FROM classes WHERE name = 'B1');

INSERT INTO students (id, name, class_id, student_number, date_of_birth, parent_phone, parent_email) VALUES
(60, 'Adam Torres',      @b1, '60', '2007-03-05', '050-3333001', 'parent60@gmail.com'),
(61, 'Beth Peterson',    @b1, '61', '2007-07-17', '050-3333002', 'parent61@gmail.com'),
(62, 'Chris Gray',       @b1, '62', '2007-01-29', '050-3333003', 'parent62@gmail.com'),
(63, 'Daisy Ramirez',    @b1, '63', '2007-09-10', '050-3333004', 'parent63@gmail.com'),
(64, 'Eli James',        @b1, '64', '2007-11-22', '050-3333005', 'parent64@gmail.com'),
(65, 'Faith Watson',     @b1, '65', '2007-04-04', '050-3333006', 'parent65@gmail.com'),
(66, 'Gary Brooks',      @b1, '66', '2007-06-16', '050-3333007', 'parent66@gmail.com'),
(67, 'Holly Kelly',      @b1, '67', '2007-02-08', '050-3333008', 'parent67@gmail.com'),
(68, 'Ian Sanders',      @b1, '68', '2007-08-20', '050-3333009', 'parent68@gmail.com'),
(69, 'Jane Price',       @b1, '69', '2007-12-01', '050-3333010', 'parent69@gmail.com'),
(70, 'Kyle Bennett',     @b1, '70', '2007-05-13', '050-3333011', 'parent70@gmail.com'),
(71, 'Lily Wood',        @b1, '71', '2007-10-25', '050-3333012', 'parent71@gmail.com'),
(72, 'Mike Barnes',      @b1, '72', '2007-03-18', '050-3333013', 'parent72@gmail.com'),
(73, 'Nora Ross',        @b1, '73', '2007-07-30', '050-3333014', 'parent73@gmail.com'),
(74, 'Omar Henderson',   @b1, '74', '2007-01-11', '050-3333015', 'parent74@gmail.com'),
(75, 'Paige Coleman',    @b1, '75', '2007-09-23', '050-3333016', 'parent75@gmail.com'),
(76, 'Ray Jenkins',      @b1, '76', '2007-11-05', '050-3333017', 'parent76@gmail.com'),
(77, 'Sofia Perry',      @b1, '77', '2007-04-27', '050-3333018', 'parent77@gmail.com'),
(78, 'Troy Powell',      @b1, '78', '2007-06-09', '050-3333019', 'parent78@gmail.com'),
(79, 'Una Long',         @b1, '79', '2007-02-21', '050-3333020', 'parent79@gmail.com'),
(80, 'Vince Patterson',  @b1, '80', '2007-08-02', '050-3333021', 'parent80@gmail.com'),
(81, 'Willow Hughes',    @b1, '81', '2007-12-14', '050-3333022', 'parent81@gmail.com'),
(82, 'Xerxes Flores',    @b1, '82', '2007-05-26', '050-3333023', 'parent82@gmail.com'),
(83, 'Yolanda Washington',@b1,'83', '2007-10-07', '050-3333024', 'parent83@gmail.com'),
(84, 'Zane Butler',      @b1, '84', '2007-03-21', '050-3333025', 'parent84@gmail.com');

-- ============================================================
-- CLASS B2 — 11th grade (IDs 85–113, student_number 85–113)
-- ============================================================
SET @b2 = (SELECT id FROM classes WHERE name = 'B2');

INSERT INTO students (id, name, class_id, student_number, date_of_birth, parent_phone, parent_email) VALUES
(85,  'Abby Simmons',    @b2, '85',  '2007-07-01', '050-4444001', 'parent85@gmail.com'),
(86,  'Ben Foster',      @b2, '86',  '2007-01-13', '050-4444002', 'parent86@gmail.com'),
(87,  'Cara Gonzalez',   @b2, '87',  '2007-09-25', '050-4444003', 'parent87@gmail.com'),
(88,  'Dean Bryant',     @b2, '88',  '2007-11-06', '050-4444004', 'parent88@gmail.com'),
(89,  'Elena Alexander', @b2, '89',  '2007-04-18', '050-4444005', 'parent89@gmail.com'),
(90,  'Fred Russell',    @b2, '90',  '2007-06-30', '050-4444006', 'parent90@gmail.com'),
(91,  'Gale Griffin',    @b2, '91',  '2007-02-11', '050-4444007', 'parent91@gmail.com'),
(92,  'Hugo Diaz',       @b2, '92',  '2007-08-23', '050-4444008', 'parent92@gmail.com'),
(93,  'Iris Hayes',      @b2, '93',  '2007-12-04', '050-4444009', 'parent93@gmail.com'),
(94,  'Jake Myers',      @b2, '94',  '2007-05-16', '050-4444010', 'parent94@gmail.com'),
(95,  'Kim Ford',        @b2, '95',  '2007-10-28', '050-4444011', 'parent95@gmail.com'),
(96,  'Leo Hamilton',    @b2, '96',  '2007-03-09', '050-4444012', 'parent96@gmail.com'),
(97,  'Maya Graham',     @b2, '97',  '2007-07-21', '050-4444013', 'parent97@gmail.com'),
(98,  'Nick Sullivan',   @b2, '98',  '2007-01-02', '050-4444014', 'parent98@gmail.com'),
(99,  'Ora Wallace',     @b2, '99',  '2007-09-14', '050-4444015', 'parent99@gmail.com'),
(100, 'Pete Woods',      @b2, '100', '2007-11-26', '050-4444016', 'parent100@gmail.com'),
(101, 'Quinn Cole',      @b2, '101', '2007-04-07', '050-4444017', 'parent101@gmail.com'),
(102, 'Rose West',       @b2, '102', '2007-06-19', '050-4444018', 'parent102@gmail.com'),
(103, 'Sean Jordan',     @b2, '103', '2007-02-28', '050-4444019', 'parent103@gmail.com'),
(104, 'Tia Owens',       @b2, '104', '2007-08-11', '050-4444020', 'parent104@gmail.com'),
(105, 'Uri Reynolds',    @b2, '105', '2007-12-22', '050-4444021', 'parent105@gmail.com'),
(106, 'Val Fisher',      @b2, '106', '2007-05-04', '050-4444022', 'parent106@gmail.com'),
(107, 'Wade Ellis',      @b2, '107', '2007-10-16', '050-4444023', 'parent107@gmail.com'),
(108, 'Xara Harrison',   @b2, '108', '2007-03-28', '050-4444024', 'parent108@gmail.com'),
(109, 'Yuri Gibson',     @b2, '109', '2007-07-09', '050-4444025', 'parent109@gmail.com'),
(110, 'Zara McDonald',   @b2, '110', '2007-01-21', '050-4444026', 'parent110@gmail.com'),
(111, 'Alex Cruz',       @b2, '111', '2007-09-02', '050-4444027', 'parent111@gmail.com'),
(112, 'Bea Marshall',    @b2, '112', '2007-11-14', '050-4444028', 'parent112@gmail.com'),
(113, 'Carl Ortiz',      @b2, '113', '2007-04-26', '050-4444029', 'parent113@gmail.com');

-- ============================================================
-- CLASS C1 — 12th grade (IDs 114–140, student_number 114–140)
-- ============================================================
SET @c1 = (SELECT id FROM classes WHERE name = 'C1');

INSERT INTO students (id, name, class_id, student_number, date_of_birth, parent_phone, parent_email) VALUES
(114, 'Ana Gomez',       @c1, '114', '2006-03-01', '050-5555001', 'parent114@gmail.com'),
(115, 'Ben Turner',      @c1, '115', '2006-07-13', '050-5555002', 'parent115@gmail.com'),
(116, 'Cleo Flores',     @c1, '116', '2006-01-25', '050-5555003', 'parent116@gmail.com'),
(117, 'Dan Rivera',      @c1, '117', '2006-09-06', '050-5555004', 'parent117@gmail.com'),
(118, 'Eve Stone',       @c1, '118', '2006-11-18', '050-5555005', 'parent118@gmail.com'),
(119, 'Fox Nguyen',      @c1, '119', '2006-04-30', '050-5555006', 'parent119@gmail.com'),
(120, 'Gia Murray',      @c1, '120', '2006-06-12', '050-5555007', 'parent120@gmail.com'),
(121, 'Hal Reyes',       @c1, '121', '2006-02-04', '050-5555008', 'parent121@gmail.com'),
(122, 'Isa Sanders',     @c1, '122', '2006-08-16', '050-5555009', 'parent122@gmail.com'),
(123, 'Joel Price',      @c1, '123', '2006-12-27', '050-5555010', 'parent123@gmail.com'),
(124, 'Kay Bennett',     @c1, '124', '2006-05-09', '050-5555011', 'parent124@gmail.com'),
(125, 'Lou Wood',        @c1, '125', '2006-10-21', '050-5555012', 'parent125@gmail.com'),
(126, 'Meg Barnes',      @c1, '126', '2006-03-14', '050-5555013', 'parent126@gmail.com'),
(127, 'Ned Ross',        @c1, '127', '2006-07-26', '050-5555014', 'parent127@gmail.com'),
(128, 'Ola Henderson',   @c1, '128', '2006-01-07', '050-5555015', 'parent128@gmail.com'),
(129, 'Pip Coleman',     @c1, '129', '2006-09-19', '050-5555016', 'parent129@gmail.com'),
(130, 'Rex Jenkins',     @c1, '130', '2006-11-01', '050-5555017', 'parent130@gmail.com'),
(131, 'Sue Perry',       @c1, '131', '2006-04-23', '050-5555018', 'parent131@gmail.com'),
(132, 'Tom Powell',      @c1, '132', '2006-06-05', '050-5555019', 'parent132@gmail.com'),
(133, 'Ula Long',        @c1, '133', '2006-02-17', '050-5555020', 'parent133@gmail.com'),
(134, 'Van Patterson',   @c1, '134', '2006-08-28', '050-5555021', 'parent134@gmail.com'),
(135, 'Wren Hughes',     @c1, '135', '2006-12-10', '050-5555022', 'parent135@gmail.com'),
(136, 'Xen Flores',      @c1, '136', '2006-05-22', '050-5555023', 'parent136@gmail.com'),
(137, 'Yael Washington', @c1, '137', '2006-10-03', '050-5555024', 'parent137@gmail.com'),
(138, 'Ziv Butler',      @c1, '138', '2006-03-15', '050-5555025', 'parent138@gmail.com'),
(139, 'Ash Simmons',     @c1, '139', '2006-07-27', '050-5555026', 'parent139@gmail.com'),
(140, 'Bay Foster',      @c1, '140', '2006-01-08', '050-5555027', 'parent140@gmail.com');

-- ============================================================
-- CLASS C2 — 12th grade (IDs 141–170, student_number 141–170)
-- ============================================================
SET @c2 = (SELECT id FROM classes WHERE name = 'C2');

INSERT INTO students (id, name, class_id, student_number, date_of_birth, parent_phone, parent_email) VALUES
(141, 'Cal Gonzalez',    @c2, '141', '2006-09-20', '050-6666001', 'parent141@gmail.com'),
(142, 'Deb Bryant',      @c2, '142', '2006-11-01', '050-6666002', 'parent142@gmail.com'),
(143, 'Ed Alexander',    @c2, '143', '2006-04-13', '050-6666003', 'parent143@gmail.com'),
(144, 'Fay Russell',     @c2, '144', '2006-06-25', '050-6666004', 'parent144@gmail.com'),
(145, 'Gil Griffin',     @c2, '145', '2006-02-06', '050-6666005', 'parent145@gmail.com'),
(146, 'Hana Diaz',       @c2, '146', '2006-08-18', '050-6666006', 'parent146@gmail.com'),
(147, 'Ido Hayes',       @c2, '147', '2006-12-29', '050-6666007', 'parent147@gmail.com'),
(148, 'Joy Myers',       @c2, '148', '2006-05-11', '050-6666008', 'parent148@gmail.com'),
(149, 'Ken Ford',        @c2, '149', '2006-10-23', '050-6666009', 'parent149@gmail.com'),
(150, 'Lea Hamilton',    @c2, '150', '2006-03-04', '050-6666010', 'parent150@gmail.com'),
(151, 'Max Graham',      @c2, '151', '2006-07-16', '050-6666011', 'parent151@gmail.com'),
(152, 'Nia Sullivan',    @c2, '152', '2006-01-27', '050-6666012', 'parent152@gmail.com'),
(153, 'Oren Wallace',    @c2, '153', '2006-09-08', '050-6666013', 'parent153@gmail.com'),
(154, 'Pia Woods',       @c2, '154', '2006-11-20', '050-6666014', 'parent154@gmail.com'),
(155, 'Raj Cole',        @c2, '155', '2006-04-01', '050-6666015', 'parent155@gmail.com'),
(156, 'Siv West',        @c2, '156', '2006-06-13', '050-6666016', 'parent156@gmail.com'),
(157, 'Tal Jordan',      @c2, '157', '2006-02-24', '050-6666017', 'parent157@gmail.com'),
(158, 'Uri Owens',       @c2, '158', '2006-08-05', '050-6666018', 'parent158@gmail.com'),
(159, 'Viv Reynolds',    @c2, '159', '2006-12-17', '050-6666019', 'parent159@gmail.com'),
(160, 'Wes Fisher',      @c2, '160', '2006-04-29', '050-6666020', 'parent160@gmail.com'),
(161, 'Xia Ellis',       @c2, '161', '2006-10-10', '050-6666021', 'parent161@gmail.com'),
(162, 'Yam Harrison',    @c2, '162', '2006-03-22', '050-6666022', 'parent162@gmail.com'),
(163, 'Zoe Gibson',      @c2, '163', '2006-07-03', '050-6666023', 'parent163@gmail.com'),
(164, 'Abe McDonald',    @c2, '164', '2006-01-14', '050-6666024', 'parent164@gmail.com'),
(165, 'Bel Cruz',        @c2, '165', '2006-09-26', '050-6666025', 'parent165@gmail.com'),
(166, 'Cam Marshall',    @c2, '166', '2006-11-07', '050-6666026', 'parent166@gmail.com'),
(167, 'Del Ortiz',       @c2, '167', '2006-04-19', '050-6666027', 'parent167@gmail.com'),
(168, 'Eli Gomez',       @c2, '168', '2006-06-30', '050-6666028', 'parent168@gmail.com'),
(169, 'Flo Turner',      @c2, '169', '2006-02-11', '050-6666029', 'parent169@gmail.com'),
(170, 'Guy Flores',      @c2, '170', '2006-08-22', '050-6666030', 'parent170@gmail.com');

-- Reset AUTO_INCREMENT to continue from 171
ALTER TABLE students AUTO_INCREMENT = 171;
