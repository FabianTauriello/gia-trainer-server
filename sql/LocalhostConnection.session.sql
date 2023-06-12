-- ------------------------------------- USER QUERIES -------------------------------------

-- @block
CREATE TABLE user (
   id INT NOT NULL AUTO_INCREMENT,
   email VARCHAR(255) NOT NULL,
   password VARCHAR(255) NOT NULL,
   first_name VARCHAR(255) NOT NULL,
   last_name VARCHAR(255) NOT NULL,
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
    (1, 'fabian@mail.com', 'password1', 'Fabian', 'T'), 
    (2, 'jeremy@mail.com', 'password2', 'Jeremy', 'Smith');

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

-- ------------------------------------- QUIZ ATTEMPT QUERIES -------------------------------------

-- @block
CREATE TABLE quizAttempt (
   id INT NOT NULL AUTO_INCREMENT,
   FOREIGN KEY (userId) REFERENCES user(id),
   PRIMARY KEY (id)
);

-- @block
SELECT * FROM quizAttempt;

-- @block
DROP TABLE quizAttempt;

-- @block
ALTER TABLE quizAttempt
DROP FOREIGN KEY userId;

-- ------------------------------------- GENERAL QUERIES -------------------------------------

-- @block
USE gia_trainer;

-- @block
SELECT * FROM mysql.user;

-- @block
SHOW DATABASES;

-- @block
SHOW TABLES;
