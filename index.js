const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const MongoClient = require('mongodb').MongoClient;

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/bogdan', (req, res) => {
    res.send('Salut ba chesche');
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


/*const app = express();
app.get('/bogdan', (req, res) => {
    res.send('Salut ba chesche');
});



// replace the uri string with your connection string.
const uri = "mongodb+srv://root:root@cluster0-1ny1t.mongodb.net/test?retryWrites=true&w=majority"
MongoClient.connect(uri, function(err, client) {
   if(err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
   }
   console.log('Connected...');
   const collection = client.db("bd-project").collection("position");
   console.log(collection);
   // perform actions on the collection object
   client.close();
})

*/
