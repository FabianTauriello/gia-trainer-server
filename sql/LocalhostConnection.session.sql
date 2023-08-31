-- ------------------------------------- USER TABLE QUERIES -------------------------------------

-- @block
CREATE TABLE user (
   id INT NOT NULL AUTO_INCREMENT,
   email VARCHAR(255) NOT NULL,
   password VARCHAR(255) NOT NULL,
   firstName VARCHAR(255) NOT NULL,
   lastName VARCHAR(255) NOT NULL,
   profileImgId VARCHAR(255) NOT NULL,
   profileImgColor VARCHAR(255) NOT NULL,
   PRIMARY KEY (id)
);

-- @block
SELECT * FROM user;

-- @block
-- This will reset the table i.e. all the auto incremental fields will be reset. Its a DDL and its very fast. 
TRUNCATE user

-- @block
INSERT INTO user VALUES 
    (1, 'fabian-dev@mail.com', 'password1', 'Fabian', 'T');

-- @block
DELETE FROM user WHERE id = 1;

-- @block
DELETE FROM user WHERE first_name = "jack";

-- @block
UPDATE user
SET profileImgColor = '#ED3636'
WHERE id = 2;

-- @block
ALTER TABLE user
ADD password VARCHAR(255) NOT NULL;

-- @block
ALTER TABLE user
RENAME COLUMN profileImgColor TO profileImgColor;

-- @block
ALTER TABLE user
ADD profileImgColor VARCHAR(255) NOT NULL;

-- ------------------------------------- QUIZ ATTEMPT TABLE QUERIES -------------------------------------

-- @block
CREATE TABLE quizAttempt (
   id INT NOT NULL AUTO_INCREMENT,
   userId INT NOT NULL,
   totalScore VARCHAR(25) NOT NULL,
   timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   FOREIGN KEY (userId) REFERENCES user(id),
   PRIMARY KEY (id)
);

-- @block
INSERT INTO quizAttempt VALUES (1, 1, '20');

-- @block
TRUNCATE quizAttempt;

-- @block
SELECT * FROM quizAttempt;

-- @block
ALTER TABLE quizAttempt
DROP FOREIGN KEY userId;

-- @block
SELECT COUNT(*) AS count FROM quizAttempt WHERE userId = 1;

-- @block
ALTER TABLE quizAttempt
ADD COLUMN timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- ------------------------------------- QUESTION TABLE QUERIES -------------------------------------

-- @block
CREATE TABLE question (
   id INT NOT NULL AUTO_INCREMENT,
   quizAttemptId INT NOT NULL,
   data JSON NOT NULL,
   FOREIGN KEY (quizAttemptId) REFERENCES quizAttempt(id),
   PRIMARY KEY (id)
);

-- @block
SELECT * FROM question;

-- @block
TRUNCATE question;

-- @block
INSERT INTO question (quizAttemptId, data) VALUES (14, '"{a:1, b:2}"'), (14, '"{a:1, b:2}"');

-- @block
ALTER TABLE question
DROP FOREIGN KEY quizAttemptId;

-- @block
ALTER TABLE question
RENAME COLUMN question TO data;

-- @block
RENAME TABLE answer TO question;

-- ------------------------------------- SETTINGS TABLE QUERIES -------------------------------------

-- @block
CREATE TABLE settings (
   userId INT NOT NULL,
   darkMode BOOLEAN NOT NULL,
   exposeName BOOLEAN NOT NULL,
   showQuizTimer BOOLEAN NOT NULL,
   FOREIGN KEY (userId) REFERENCES user(id),
   PRIMARY KEY (userId),
   UNIQUE KEY (userId)
);

-- @block
SELECT * FROM settings;

-- @block
SELECT * FROM settings WHERE userId = 2;

-- @block
INSERT INTO settings VALUES 
    (1, 2, true, false, false, '1', 'ED3636');

-- @block
UPDATE settings
SET profileImgColor = '#ED3636'
WHERE userId = 2;

-- @block
TRUNCATE settings;

-- @block
ALTER TABLE settings
DROP FOREIGN KEY userId;

-- @block
ALTER TABLE settings
DROP COLUMN profileImgColor;

-- @block
INSERT INTO settings (userId, darkMode, exposeName, showQuizTimer) VALUES(1, 1, 1, 1);

-- @block
UPDATE settings SET darkMode = 0, exposeName = 0, showQuizTimer = 1 WHERE userId = 1;

-- ------------------------------------- GENERAL QUERIES -------------------------------------

-- @block
CREATE DATABASE gia_trainer;

-- @block
USE gia_trainer;

-- @block
SELECT * FROM mysql.user;

-- @block
SHOW DATABASES;

-- @block
SHOW TABLES;

-- @block
DROP TABLE settings;

-- @block
DROP TABLE question;

-- @block
DROP TABLE quizAttempt;

-- @block
DROP TABLE user;

