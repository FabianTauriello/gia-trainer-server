CREATE TABLE user (
   id INT NOT NULL AUTO_INCREMENT,
   email VARCHAR(255) NOT NULL,
   password VARCHAR(255) NOT NULL,
   firstName VARCHAR(255) NOT NULL,
   lastName VARCHAR(255) NOT NULL,
   PRIMARY KEY (id)
);

CREATE TABLE quizAttempt (
   id INT NOT NULL AUTO_INCREMENT,
   userId INT NOT NULL,
   totalScore VARCHAR(25) NOT NULL,
   FOREIGN KEY (userId) REFERENCES user(id),
   PRIMARY KEY (id)
);

CREATE TABLE answer (
   id INT NOT NULL AUTO_INCREMENT,
   quizAttemptId INT NOT NULL,
   question JSON NOT NULL,
   FOREIGN KEY (quizAttemptId) REFERENCES quizAttempt(id),
   PRIMARY KEY (id)
);
