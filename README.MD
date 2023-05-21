# Brief

API for gia-trainer using Express.js

## Starting MySQL Server on my local machine (Mac OS)

root user access:

```
mysql -u root -p
```

"no-user" access:

```
mysql
```

##STEPS TO AUTHENTICATION

To authenticate users on your MySQL Express.js app, you can follow the steps below:

- Create a user table in your MySQL database to store user information such as username, email, password, and any other relevant information you want to store.
- Create a login page in your Express.js app where users can enter their username and password.
- When a user submits their login credentials, your Express.js app should query the user table in your MySQL database to retrieve the user's information.
- Verify that the password entered by the user matches the password stored in the database. You should use a secure password hashing algorithm to store passwords in the database, such as bcrypt or scrypt.
- If the username and password are correct, create a session for the user to maintain their authentication state. You can use a session middleware for Express.js, such as express-session, to manage sessions.
- Once a session has been created, you can restrict access to certain pages or resources in your Express.js app by checking if the user is authenticated. You can use middleware to check if a user is authenticated, and redirect them to the login page if they are not.
