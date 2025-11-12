const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors=require('cors')
const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

//iV6RERmMGVtiikp9
//Book-Haven

const uri = "mongodb+srv://Book-Haven:iV6RERmMGVtiikp9@cluster0.t2y7ypa.mongodb.net/?appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    
    const myDB = client.db("myDB");
    const myColl = myDB.collection("Book-store");

    app.post('/add-book', async (req, res) => {
      const data = req.body;
      const result = await myColl.insertOne(data);
      res.send(result);
    })

     app.get('/all-books', async (req, res) => {
      const cursor = myColl.find({});
      const allValues = await cursor.toArray();
      res.send(allValues);
    })

      app.delete('/delete-book/:id', async (req, res) => {
          const id = req.params.id;
          let query = { _id: new ObjectId(id) };
          const result = await myColl.deleteOne(query);
          res.send(result);
     });


        app.get('/book-details/:id', async (req, res) => {
           const id = req.params.id;
           const query = { _id: new ObjectId(id) };
           const result = await myColl.findOne(query);
           res.send(result);
         })



  app.patch('/update-book/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;

        const query = { _id: new ObjectId(id) };

        const update = {
            $set: {
                title: data.title,
                author: data.author,
                genre: data.genre,
                rating: data.rating,
                summary: data.summary,
                coverImage: data.coverImage,
                userEmail: data.userEmail
            }
        };

        const result = await myColl.updateOne(query, update);

        if (result.matchedCount === 0) {
            return res.status(404).send({ message: "Book not found" });
        }

        res.send({ message: "Book updated successfully", result });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Something went wrong" });
    }
});


  } finally {
   
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})