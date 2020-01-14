const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require("body-parser");
const { uniqueNamesGenerator, adjectives, colors, animals, names } = require('unique-names-generator');


const app = express();
let db = null;

//https://www.google.com/maps/d/u/0/edit?mid=1W_8N0xry1DN4jcFIou11gS0OzdZN5Skk&ll=44.43498717033809%2C26.048440648176665&z=19

const borderPoints = [
   //p1
	{
		x: 44.43537, 
		y: 26.04726
	},
	//p2
	{
		x: 44.43498, 
		y: 26.04725
	},
	//p3
	{
		x: 44.435, 
		y: 26.0478
	},
	//p4
	{
		x: 44.43537, 
		y: 26.0478
	},
	//p5
	{
		x: 44.43537, 
		y: 26.04845
	},
	//p6
	{
		x: 44.43498, 
		y: 26.04844
	},
	//p7
	{
		x: 44.43468, 
		y: 26.04726
	},
	//p8
	{
		x: 44.43471, 
		y: 26.04842
	},
];

app
  .use(express.static(path.join(__dirname, 'public')))
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/bogdan', (req, res) => {
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
	  })
	.get('/stadiumAreas', (req, res) => {
			res.send(JSON.stringify({
				pink: {
					topLeft: borderPoints[0],
					topRight: borderPoints[3],
					bottomLeft: borderPoints[1],
					bottomRight: borderPoints[2]
				},
				yellow: {
					topLeft: borderPoints[3],
					topRight: borderPoints[4],
					bottomLeft: borderPoints[2],
					bottomRight: borderPoints[5]
				},
				orange: {
					topLeft: borderPoints[1],
					topRight: borderPoints[5],
					bottomLeft: borderPoints[6],
					bottomRight: borderPoints[7]
				}
			}))
	  })
	.get('/adminData', (req, res) => {
		db.collection("positions").find({}).toArray(function (err, result) {
				if (err) {
					console.log('error');
				    res.send(err);
				} else {
					const stadium = {
						pink: 0,
						yellow: 0,
						orange: 0,
					}
					result.forEach((point, index) => {
						console.log('here ' + point.xPosition + " - " + point.yPosition);
						if (point.xPosition >= borderPoints[0].x - 0.001 && point.xPosition <= borderPoints[3].x + 0.0001
							&& point.yPosition <= borderPoints[0].y + 0.001 && point.yPosition <= borderPoints[3].y + 0.001
							&& point.xPosition >= borderPoints[1].x - 0.001 && point.xPosition <= borderPoints[2].x + 0.0001
							&& point.yPosition >= borderPoints[1].y - 0.0001 && point.yPosition >= borderPoints[2].y - 0.0001) {
							stadium.pink = stadium.pink + 1;
						} else if(point.xPosition >= borderPoints[3].x - 0.001 && point.xPosition <= borderPoints[4].x + 0.001
							&& point.yPosition <= borderPoints[3].y + 0.001 && point.yPosition <= borderPoints[4].y + 0.001
							&& point.xPosition >= borderPoints[2].x - 0.001 && point.xPosition <= borderPoints[5].x + 0.001
							&& point.yPosition >= borderPoints[2].y - 0.0001 && point.yPosition >= borderPoints[5].y - 0.0001) {
							stadium.yellow = stadium.yellow + 1;
						} else if(point.xPosition >= borderPoints[1].x - 0.001 && point.xPosition <= borderPoints[5].x + 0.001
							&& point.yPosition <= borderPoints[1].y + 0.001 && point.yPosition <= borderPoints[5].y + 0.001
							&& point.xPosition >= borderPoints[6].x - 0.001 && point.xPosition <= borderPoints[7].x + 0.001
							&& point.yPosition >= borderPoints[6].y - 0.001 && point.yPosition >= borderPoints[7].y - 0.001) {
							stadium.orange = stadium.orange + 1;
							console.log(point)
						}
					});
				    res.send(JSON.stringify(stadium));
					//console.log(JSON.stringify(result));
				}
			})
	  })
	.post('/newUser', (req, res) => {
		if (req.body.loginCode.length === 6) {
			const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, names] });
			res.send(JSON.stringify({userName: randomName}));

		} else {
			res.status(500).send({error: "The login code should be a 6 chars string!"});
		}

	  })
	.post('/userPosition', (req, res) => {
		const collection = db.collection("positions");
		const stadium = db.collection("stadium-occ");

        collection.findOne({"userName": req.body.userName}, (error, userResult) => {
				if (error) {
					res.status(500).send(err);
				} else {
					console.log(userResult);
					//res.send(userResult);	
					if (userResult === null) {
						// should create a new user entry
						collection.insert(req.body, () => {
							res.send(JSON.stringify(req.body));
						});
					} else {
						collection.update({"userName": req.body.userName}, req.body, (err, count, responseObj) => {
							res.send(JSON.stringify(req.body));
						});
					}			
				}		
			});
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
})
