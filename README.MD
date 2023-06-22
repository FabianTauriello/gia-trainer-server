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
- [ ] install and configure nginx for handling https requests from the vercel app, or try letsencrypt for generating a ssl/tls certificate. see this: https://betterprogramming.pub/setup-nginx-for-your-nodejs-server-on-ec2-ae46a3d0cb1b
- [ ] remove questions.json from git!!! answers are out there for public to see!
- [ ] block public access to /quizQuestions (mayber provide a subset of all questions for visitors) because answers are leaked.

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

### Connecting to server on AWS EC2 instance:

### Important commands:

Build TS to JS files for deployment

```
npm run build
```

Start server from inside dist folder

```
pm2 start index.js
```

Clear logs

```
pm2 flush
```

Stop process

```
pm2 delete
```

Connect to ec2 instance

```
ssh -i aws-key.pem ubuntu@ec2-3-145-91-237.us-east-2.compute.amazonaws.com
```

List installed packages

```
apt list --installed
```

Restart nginx

```
sudo systemctl restart nginx
```

List port forwarding rules

```
sudo iptables -t nat --line-numbers -n -L
```

Remove port forwarding rule

```
sudo iptables -t nat -D PREROUTING <rule_number>
```

Add port forwarding rule

```
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 5000
```

Transfer file to ec2 instance

```
scp -i <ssh_key_path> <sending_file_path> ubuntu@3.145.91.237:
```
