require("dotenv").config()
const express = require('express');
const db = require("./config/dbmysql");
const path = require('path');
const cors = require('cors');
const token = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();
const bodyParser = require('body-parser')
const port = process.env.PORT

app.set("port", port || 0402)

app.use(express.json(), cors(), express.static("public"))

app.listen(port, () => {
    console.log(`Server running on ${port}`);
})

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
})

const productRoute = require('./routes/productsRoute')
app.use("/products", productRoute)

