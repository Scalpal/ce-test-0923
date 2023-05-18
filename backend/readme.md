To make this working you'll need to do these :

1-Create a file named .env with this inside :

PORT=3000
DB_HOST="localhost"
DB_PORT=5432
DB_USER=YOUR_DB_USER
DB_PASSWORD=""
DB_DATABASE=YOUR_DB_NAME

DB_USER and DB_DATABASE depends on how is called your db user in postgres and how the database is called for the project

2- npm i

3- As soon as the database is created to load the initial schema migration : npx knex migrate:latest

4- There you go, it's working and you can try the routes on postman
