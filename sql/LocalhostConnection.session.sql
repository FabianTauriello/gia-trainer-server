-- @block
USE gia_trainer;

-- @block
CREATE TABLE user (
   id INT NOT NULL AUTO_INCREMENT,
   email VARCHAR(255) NOT NULL,
   first_name VARCHAR(255) NOT NULL,
   last_name VARCHAR(255) NOT NULL,
   PRIMARY KEY (id)
);

-- @block
DROP TABLE user;

-- @block
INSERT INTO user VALUES 
    (1, 'fabian', 't', 'fabian@mail.com'), 
    (2, 'jeremy', 'smith', 'jeremy@mail.com');

-- @block
DELETE FROM user WHERE id = "1";

-- @block
SHOW TABLES;

-- @block
SELECT * FROM user;

-- stored procedure:
CREATE PROCEDURE do_something
AS
SHOW TABLES
GO;

-- @block
do_something;