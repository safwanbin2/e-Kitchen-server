const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const port = process.env.PORT || 5000;


const app = express();
app.use(express.json())
app.use(cors());

app.get('/', (req, res) => {
    res.send('eKitchen server is running fine');
})











app.listen(port, () => {
    console.log(`server running on ${port}`)
})