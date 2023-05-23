-- GIA_TRAINER QUERIES

-- @block
USE gia_trainer;

-- @block
SELECT * FROM user;

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
DROP TABLE user;

-- @block
INSERT INTO user VALUES 
    (1, 'fabian@mail.com', 'password1', 'fabian', 't'), 
    (2, 'jeremy@mail.com', 'password2', 'jeremy', 'smith');

-- @block
DELETE FROM user WHERE id = "1";

-- @block
DELETE FROM user WHERE first_name = "jack";

-- @block
-- This will reset the table i.e. all the auto incremental fields will be reset. Its a DDL and its very fast. 
TRUNCATE user

-- @block
UPDATE user
SET password = 'password1'
WHERE email = 'fabian';

-- @block
ALTER TABLE user
ADD password VARCHAR(255) NOT NULL;

-- GENERAL QUERIES

-- @block
SELECT * FROM mysql.user;

-- @block
SHOW DATABASES;

-- @block
SHOW TABLES;
