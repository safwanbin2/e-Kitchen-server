const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();
app.use(express.json())
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.6ua546u.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        console.log('mongodb connected successfully')
    } catch (error) {
        console.log(error)
    }
}
run();

const ServiceCollection = client.db('eKitchen').collection('services');

app.get('/', (req, res) => {
    res.send('eKitchen server is running fine');
})

app.get('/services', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        const query = {};
        const cursor = ServiceCollection.find(query);
        const data = await cursor.limit(limit).toArray();
        console.log(data)
        res.send(data)
    } catch (error) {
        console.log(error)
    }
})

app.get('/services/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const query = { _id: ObjectId(id) }
        const data = await ServiceCollection.findOne(query)
        res.send(data);
    } catch (error) {
        console.log(error)
    }
})








app.listen(port, () => {
    console.log(`server running on ${port}`)
})