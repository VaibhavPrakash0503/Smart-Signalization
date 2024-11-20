var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var bcrypt = require("bcrypt");

require('dotenv').config(); 

const app=express()

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))

mongoose.connect('mongodb://localhost:27017/TrafficLight')
var db = mongoose.connection
db.on('error',()=> console.log("Error in Connecting to Database"))
db.once('open',()=> console.log("Connected to Database"))

app.post("/register", async (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    try {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        var data = {
            "name": name,
            "email": email,
            "password": hashedPassword
        };
        db.collection('users').insertOne(data, (err, collection) => {
            if (err) {
                throw err;
            }
            console.log("Record Inserted Successfully");
        });
        return res.redirect('registration_successful.html');
    } catch (error) {
        console.error("Error hashing password:", error);
        return res.status(500).send("Internal Server Error");
    }
});

app.post("/login", async (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    try {
        const user = await db.collection('users').findOne({ email: email });
        if (!user) {
            return res.redirect('/login.html?error=Invalid email or password');
        }

        // Compare the hashed password with the user's input
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.redirect('/login.html?error=Invalid email or password');
        }

        // If password matches, redirect to Maps.html
        return res.redirect('Maps.html');
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).send("Internal Server Error");
    }
});


app.get('/markers', async (req, res) => {
    try {
        // Fetch all markers from the collection
        const markers = await db.collection('Marker').find({}).toArray();
        res.json(markers); // Send the markers data as JSON response
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving markers');
    }
});

// Endpoint to send the API key to the frontend
app.get("/get-maps-api-key", (req, res) => {
    res.json({ apiKey: process.env.API_KEY });
});

app.get("/",(req,res) => {
    res.set({
        "Allow-acces-Allow-Origin":'*'
    })
    return res.redirect('home.html')
}).listen(3000);

console.log("Listening on port 3000")