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

### DB Design

![schema 2](assets/db-schema.png "DB Schema")

### Stack

- **MySQL** for database management (hosting with AWS RDS).
- **bcrypt** for hashing passwords.
- **jwt** for authenticaing requests that require verification.
- **Let's Encrypt** for ssl certification generation via certbot
- **express js** for serving api
- **nginx** for actings as the reverse proxy
- **Passport** for authentication middleware

### Connecting to server on AWS EC2 instance:

### Domain registerd for this server:

gia-trainer.com

### Notes:

- Changes to this repo must be pulled from the server. See the commands below for guidance.

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

Restart server:

```
reload_gts
```

Edit nginx config file:

```
edit_nginx
```

Edit bash config file (for changing aliases):

```
edit_bash
```

Reload bash config file:

```
reload_bash
```

Show systemd logs:

```
show_logs
```
