-- @block
CREATE TABLE Users(
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE
);

-- @block
SELECT * FROM Users;

-- @block
INSERT INTO Users VALUES (1, 'fabian@mail.com'), (2, 'jeremy@mail.com');

-- @block
DELETE FROM Users WHERE id = "1";