# Self-care backend

## Getting started
- Install dependencies with `npm i`
- Create `.env` file in root directory with fields in `.env.template`
- Run `npm start`

## How to talk to DB?
We are using sequelize.js as ORM. All CRUD operations can be done via sequelize from the backend.

## Testing API call
- Install `curl`
- On a separate terminal from the server, run `curl -X GET http://localhost:8080/users/` and you should get a json response of an example user