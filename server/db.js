// mongodb Example

const { MongoClient, ServerApiVersion } = require('mongodb')
const uri =
  'mongodb+srv://dbUser:<db_password>@api2425.b1y4vod.mongodb.net/?retryWrites=true&w=majority&appName=api2425'
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect()
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 })
    console.log('Pinged your deployment. You successfully connected to MongoDB!')
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close()
  }
}
run().catch(console.dir)

// mongoose example

const mongoose = require('mongoose')
const url =
  'mongodb+srv://dbUser:<db_password>@api2425.b1y4vod.mongodb.net/?retryWrites=true&w=majority&appName=api2425'
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } }
async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions)
    await mongoose.connection.db.admin().command({ ping: 1 })
    console.log('Pinged your deployment. You successfully connected to MongoDB!')
  } finally {
    // Ensures that the client will close when you finish/error
    await mongoose.disconnect()
  }
}
run().catch(console.dir)
