const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const MongoClient = require('mongodb').MongoClient;

const app = express();
let db = null;

app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/bogdan', (req, res) => {
    //res.send('Salut ba chesche');
	db.collection("positions").find({}).toArray(function (err, result) {
		    if (err) {
				//console.log('error');
		        //res.send(err);
		    } else {
				res.send(JSON.stringify({message: "Ce cauti aici?"}));
		        //res.send(JSON.stringify(result));
				console.log(JSON.stringify(result));
		    }
		})
  })
	.get('/allPositions', (req, res) => {
		db.collection("positions").find({}).toArray(function (err, result) {
				if (err) {
					console.log('error');
				    res.send(err);
				} else {
				    res.send(JSON.stringify(result));
					console.log(JSON.stringify(result));
				}
			})
	  });
  




// replace the uri string with your connection string.
const uri = "mongodb+srv://root:root@cluster0-1ny1t.mongodb.net/test?retryWrites=true&w=majority"
MongoClient.connect(uri, function(err, client) {
   if(err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
   }
   	console.log('Connected...');
	db = client.db("bd-project");
	app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
   /*const collection = client.db("bd-project").collection("positions").find({}).toArray(function (err, result) {
        if (err) {
			console.log('error');
            //res.send(err);
        } else {
            //res.send(JSON.stringify(result));
			console.log(JSON.stringify(result));
        }
    })
  
   // perform actions on the collection object
   client.close();*/
})
