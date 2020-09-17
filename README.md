# Self-care backend

## Getting started

- Create a `.env` file in the root directory by renaming the `.env.template` file. You will need the confidential information used for certain environment variables.
- Install [Docker](https://www.docker.com/) (if you don't already have it)
- Run `docker-compose up`
- Use `CTRL + C` to stop the process once you are done
- Run `docker-compose down`

## How to talk to DB?

We are using sequelize.js as ORM. All CRUD operations can be done via sequelize from the backend.

## Testing API call

- Install `curl`
- On a separate terminal from the server, run `curl -X GET http://localhost:3000/users/` and you should get a json response of users in the database
