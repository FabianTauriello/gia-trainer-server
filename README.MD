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
- **Let's Encrypt** for ssl certification generation via certbot
- **express js** for serving api
- **nginx** for actings as the reverse proxy

### Connecting to server on AWS EC2 instance:

### Domain registerd for this server:

gia-trainer.com

### Important commands:

Connect to ec2 instance:

```
ssh -i ~/Desktop/ssh/aws-key.pem ec2-user@ec2-13-40-222-178.eu-west-2.compute.amazonaws.com
```

Open bash config file:

```
sudo vim ~/.bashrc
```

_Make sure to reload the configuration with `source ~/.bashrc` after saving any changes._

Get status of nginx:

```
sudo systemctl status nginx
```

Restart nginx:

```
sudo systemctl restart nginx
```

Get nginx error log:

```
sudo tail -f /var/log/nginx/error.log
```

Get systemd logs (for viewing server console logs):

```
sudo cat /var/log/messages
```

Test nginx config file is valid:

```
sudo nginx -t
```

Transfer file to ec2 instance:

```
scp -i ~/Desktop/ssh/aws-key.pem <sending_file_path> ec2-user@ec2-13-40-222-178.eu-west-2.compute.amazonaws.com
```

### Alias Commands

Pull changes from remote repo:

```
pull_gts
```

Build server:

```
build_gts
```

Edit nginx config file:

```
edit_nginx
```

Edit bash config file (for changing aliases):

```
edit_bash
```

Show systemd logs:

```
show_logs
```
