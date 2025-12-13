const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const express = require("express");
const app = express();
const connectToDb = require("./db/db");



app.use(cors());
connectToDb();




app.get("/", (req, res)=> {
    res.send('Hello World');
})

module.exports = app;