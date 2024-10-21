const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const db = require("./db");
require('dotenv').config
app.use(bodyParser.json());

const port = process.env.PORT||3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});


app.use("/",userRoutes);

app.listen(port, () => {
    console.log(`Server is running on PORT ${port}`);
});