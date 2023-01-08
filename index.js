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
    app.get('/services', async (req, res) => {
      const query = {};
      const result = await serviceCollection.find(query).toArray();
      // const date = req.query.date;
      // console.log(date);
      // const query = {};
      // const options = await servicesCollection.find(query).toArray();
      // const bookingQuery = { appointmentDate: date }
      // const alreadyBooked = await bookingCollection.find(bookingQuery).toArray();
      // options.forEach(option => {
      //   const optionBooked = alreadyBooked.filter(book => book.treatmentName === option.name);
      //   const bookSlots = optionBooked.map(book => book.slot);
      //   const remainingSlots = option.slots.filter(slot => !bookSlots.includes(slot))
      //   console.log(date, option.name, remainingSlots.length);
      //   option.slots = remainingSlots;
      // })
      res.send(result);
    });
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