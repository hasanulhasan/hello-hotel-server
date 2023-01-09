const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

//middle wares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zjh2ngr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    const serviceCollection = client.db('helloHotel').collection('services');
    const bookingCollection = client.db('helloHotel').collection('bookings');
    app.get('/services', async (req, res) => {
      const date = req.query.date;
      const query = {};
      const options = await serviceCollection.find(query).toArray();
      const bookingQuery = { date: date }
      const alreadyBooked = await bookingCollection.find(bookingQuery).toArray();
      options.forEach(option => {
        const optionBooked = alreadyBooked.filter(book => book.name === option.name);
        const bookRooms = optionBooked.map(book => book.roomNumber);
        const remainingRooms = option.rooms.filter(room => !bookRooms.includes(room))
        option.rooms = remainingRooms;
      })
      res.send(options);
    });

    app.post('/bookings', async (req, res) => {

      const booking = req.body
      //if we want to limit to a man to book only one room in one day............
      // console.log(booking);
      // const query = {
      //   date: booking.date,
      //   name: booking.name,
      //   // email: booking.email
      // };
      // const alreadyBooked = await bookingCollection.find(query).toArray();
      // if (alreadyBooked.length) {
      //   const message = `You already have an book on ${booking.date}`
      //   res.send({ acknowledged: false, message })
      // }
      // else {
      // }
      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    })
  }
  finally {

  }
}
run().catch(e => console.error(e))

app.get('/', (req, res) => {
  res.send('Hello Hotel server is running');
})

app.listen(port, () => {
  console.log(`Hello Hotel server on ${port}`)
})