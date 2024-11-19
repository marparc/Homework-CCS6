insert into sysadm values 
	(1, 'Reniel Acocoro'),
    (2, 'Phoebe Amistoso'),
    (3, 'Marc Partosa');
    
insert into user_table values
	(1, 'Olivia', 'Dela Cruz', '09876352671', '2000-05-14', 'Student'),
    (2, 'Charlotte', 'Reyes', '09123456789', '2002-11-30', 'Student'),
    (3, 'Sophia', 'Santos', '09765432109', '2003-04-07', 'Student'),
    (4, 'Liam', 'Garcia', '09213456708', '1993-09-18', 'Client'),
    (5, 'Oliver', 'Santos', '09456789123', '1990-12-25', 'Client'),
    (6, 'Theodore', 'Bautista', '09678901234', '1991-08-23', 'Client');
    
insert into user_account values 
	(1, 'Olivia Dela Cruz', 'Verified', 'db2admin', 'I love coding', 1),
    (2, 'Charlotte Reyes', 'Verified', 'db2admin', 'I study 24/7', 2),
    (3, 'Sophia Santos', 'Pending', 'db2admin', 'I cook pasta for work', 3),
    (4, 'Liam Garcia', 'Verified', 'db2admin', 'Math is love', 4),
    (5, 'Oliver Santos', 'Pending', 'db2admin', 'My mind works like a supercomputer', 5),
    (6, 'Theodore Baustista', 'Verified', 'db2admin', 'To code is to live', 6);
    
insert into student values 
	(1, 'College', 'BS in Computer Science', 'Silliman University', 'Second Year', 'Gcash', '09876352671', 1),
    (2, 'College', 'AS in Culinary Arts', 'Silliman University', 'Third Year', 'Gcash', '09123456789', 2),
    (3, 'Senior High', 'STEAM', 'Foundation University', 'Grade 12', 'Paymaya', '09765432109', 3);
    
insert into client_table values
	(1, null, 4),
	(2, 'Figma Incorporation', 5),
    (3, 'Jollibee Foods Corporation', 6);
    
insert into portfolio values
	(1, 'Event Pubmats', 'Pubmats I\'ve created for occasions', 'https://drive.google.com/drive/folders/1B7PQNPsa2DWoJLLnQHdfL3TLx0-A5UNY?usp=sharing', 1),
    (2, 'Announcement Pubmats', 'School announcement pubmats', 'https://drive.google.com/drive/folders/1B7PQNPsa2DWoJLLnQHdfL3TLx0-A5UNY?usp=sharing', 1),
    (3, 'Commercial Videos', 'How I edit videos for advertising', 'https://drive.google.com/drive/folders/1B7PQNPsa2DWoJLLnQHdfL3TLx0-A5UNY?usp=sharing', 2);
    
insert into services values
	(1, 'Social Media Pubmat', 150.00, 1),
    (2, 'Video Editing', 3000.00, 2),
    (3, 'Photography', 1500.00, 3);
    
insert into service_request values
	(1, 'Accepted', 3, 1),
    (2, 'Accepted', 1, 1),
    (3, 'Accepted', 2, 3);
    
insert into job_listing values
	(1, 'Create a Powerpoint', 'Design a PowerPoint presentation about system architect', 800.00, 'Remote', NULL, NULL, '2024-11-30', '2024-11-01', 'In Progress', 1, NULL),
    (2, 'Clean Garage', 'Clean and organize garage space', 1000.00, 'Onsite', 9.31165855594027, 123.30746748687801, '2024-12-15', '2024-11-05', 'In Progress', 2, null),
	(3, 'Create Design for Mrktg Campaign', 'Design marketing materials for campaign', 1500.00, 'Remote', NULL, NULL, '2024-12-20', '2024-11-10', 'In Progress', 3, null);
    
insert into application values
	(1, 'Applying for part-time PowerPoint creation job', 'Approved', 1, 1),
    (2, 'Interested in cleaning garage job', 'Approved', 2, 2),
    (3, 'Applying for design work for marketing campaigns', 'Approved', 3, 3);
    
insert into chat values
	(1, 3, 1),
    (2, 1, 1),
    (3, 2, 3);

insert into message_logs values
	(1, now(), 'Hello! I wanted you to make me a pubmat.', 1, 3, null),
    (2, now(), 'Hi! Thank you for reaching out. I will create one.', 1, null, 1),
    (3, now(), 'Good morning. I had a request for how to do this.', 2, 2, null);
    
insert into stud_evaluation values
	(1, 4, 'Service done was good.', 3, 1),
    (2, 5, 'Work did was great. Really followed my instructions.', 1, 1),
    (3, 4, 'Finished on time. Did really well.', 2, 3);
    
insert into client_evaluation values
	(1, 5, 'They were very understanding.', 3, 1),
    (2, 5, 'I had a great time', 1, 1),
    (3, 4, 'Pretty nice to work with.', 2, 3);

insert into payment values
	(1, '2349812474', 3, 1),
    (2, '5479603025', 1, 1),
    (3, 'Cash', 2, 3);