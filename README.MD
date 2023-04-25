# Brief

API for gia-trainer using Express.js

## Typescript and general project setup:

- install Typescript and types for express and node: npm i typescript @types/express @types/node
- create basic/default ts config file: npx tsc --init
- automate transpiling process and restarting of server after changes with nodemon
- add "build", "prestart", "start", "preserve", and "serve" scripts to package.json
- install rimraf to clear out transpiled folder after file deletions/additions
