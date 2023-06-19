# Brief

API for gia-trainer using Express.js

### Starting MySQL Server on my local machine (Mac OS)

root user access:

```
mysql -u root -p
```

"no-user" access:

```
mysql
```

### TODOs:

- [ ] consider adding dist folder to .gitIgnore
- [ ] add tests for all API endpoints to postman
- [ ] remove questions.json from git!!! answers are out there for public to see!

### DB Schemas

The following diagrams illustrate two options for storing app data, specifically quiz attempt data. I have chosen to adopt **option 2** because of it's simplicity. However, if querying/indexing or data integrity and validation are issues, migrating to **option 1** should be considered.

_Option 1:_
![schema 1](assets/schema-1.png "Title")

_Option 2:_
![schema 2](assets/schema-2.png "Title")

### Stack

- **MySQL** for database management (hosting with AWS RDS).
- **bcrypt** for hashing passwords.
- **jwt** for authenticaing requests that require verification.
