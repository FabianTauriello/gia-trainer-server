-- ------------------------------------- USER TABLE QUERIES -------------------------------------

-- @block
CREATE TABLE user (
   id INT NOT NULL AUTO_INCREMENT,
   email VARCHAR(255) NOT NULL,
   password VARCHAR(255) NOT NULL,
   firstName VARCHAR(255) NOT NULL,
   lastName VARCHAR(255) NOT NULL,
   PRIMARY KEY (id)
);

-- @block
SELECT * FROM user;

-- @block
DROP TABLE user;

-- @block
-- This will reset the table i.e. all the auto incremental fields will be reset. Its a DDL and its very fast. 
TRUNCATE user

-- @block
INSERT INTO user VALUES 
    (1, 'fabian-dev@mail.com', 'password1', 'Fabian', 'T');

-- @block
DELETE FROM user WHERE id = "1";

-- @block
DELETE FROM user WHERE first_name = "jack";

-- @block
UPDATE user
SET password = 'password1'
WHERE email = 'fabian';

-- @block
ALTER TABLE user
ADD password VARCHAR(255) NOT NULL;

-- @block
ALTER TABLE user
RENAME COLUMN last_name TO lastName;

-- ------------------------------------- QUIZ ATTEMPT TABLE QUERIES -------------------------------------

-- @block
CREATE TABLE quizAttempt (
   id INT NOT NULL AUTO_INCREMENT,
   userId INT NOT NULL,
   totalScore VARCHAR(25) NOT NULL,
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
DROP TABLE quizAttempt;

-- @block
ALTER TABLE quizAttempt
DROP FOREIGN KEY userId;


-- ------------------------------------- ANSWER TABLE QUERIES -------------------------------------

-- @block
CREATE TABLE answer (
   id INT NOT NULL AUTO_INCREMENT,
   quizAttemptId INT NOT NULL,
   question JSON NOT NULL,
   FOREIGN KEY (quizAttemptId) REFERENCES quizAttempt(id),
   PRIMARY KEY (id)
);

-- @block
SELECT * FROM answer;

-- @block
TRUNCATE answer;

-- @block
INSERT INTO answer (quizAttemptId, question) VALUES (14, '"{a:1, b:2}"'), (14, '"{a:1, b:2}"');

-- @block
DROP TABLE answer;

-- @block
ALTER TABLE answer
DROP FOREIGN KEY quizAttemptId;

-- ------------------------------------- SETTINGS TABLE QUERIES -------------------------------------

-- @block
CREATE TABLE settings (
   id INT NOT NULL AUTO_INCREMENT,
   quizAttemptId INT NOT NULL,
   question JSON NOT NULL,
   FOREIGN KEY (quizAttemptId) REFERENCES quizAttempt(id),
   PRIMARY KEY (id)
);

-- @block
SELECT * FROM answer;

-- @block
TRUNCATE answer;

-- @block
INSERT INTO answer (quizAttemptId, question) VALUES (14, '"{a:1, b:2}"'), (14, '"{a:1, b:2}"');

-- @block
DROP TABLE answer;

-- @block
ALTER TABLE answer
DROP FOREIGN KEY quizAttemptId;

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

