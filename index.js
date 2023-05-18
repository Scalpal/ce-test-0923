import express from "express";
import config from "./backend/src/config.js";
import prepareRoutes from "./backend/src/prepareRoutes.js";
import knex from "knex";

const db = knex(config.db)
const app = express();

app.use(express.json());
app.use((req, res, next) => {
  
  next()
})

prepareRoutes({ app, db })

app.listen(config.port, () => console.log(`Listening to port ${config.port}`))