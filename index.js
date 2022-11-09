// requiring/importing nessecity

const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const port = process.env.PORT || 5000;

// using middlewares
const app = express();
app.use(express.json())
app.use(cors());

// url/uri for mongo db
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.6ua546u.mongodb.net/?retryWrites=true&w=majority`;

// mongo db client
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// root function to connect client to mongo db
async function run() {
    try {
        await client.connect();
        console.log('mongodb connected successfully')
    } catch (error) {
        console.log(error)
    }
}
run();

// getting the collections from mongodb
const ServiceCollection = client.db('eKitchen').collection('services');
const ReviewCollection = client.db('eKitchen').collection('reviews');

// root destination of the API
app.get('/', (req, res) => {
    res.send('eKitchen server is running fine');
})

// BASIC crud operations
app.post('/services', async (req, res) => {
    try {
        const newService = req.body;
        const data = await ServiceCollection.insertOne(newService);

        res.send(data);
    } catch (error) {
        console.log(error)
    }
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

app.post('/reviews', async (req, res) => {
    try {
        const newReview = req.body;
        const data = await ReviewCollection.insertOne(newReview);

        res.send(data);
    } catch (error) {
        console.log(error)
    }
})

app.get('/reviews', async (req, res) => {
    try {
        let query = {};
        if (req.query.email) {
            query = {
                email: req.query.email
            }
        }
        const cursor = ReviewCollection.find(query);
        const data = await cursor.toArray();

        res.send(data.reverse());
    } catch (error) {
        console.log(error)
    }
})

app.get('/reviews/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const query = { serviceId: id }
        const cursor = ReviewCollection.find(query);
        const data = await cursor.toArray();

        res.send(data.reverse());
    } catch (error) {
        console.log(error)
    }
})

app.delete('/reviews/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const data = await ReviewCollection.deleteOne(query);

        res.send(data);
    } catch (error) {
        console.log(error)
    }
})




// listening in the post 
app.listen(port, () => {
    console.log(`server running on ${port}`)
})