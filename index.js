var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")

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

app.post("/register",(req,res) => {
    var name = req.body.name
    var email = req.body.email
    var phno = req.body.phno
    var password = req.body.password

    var data={
        "name":name,
        "email":email,
        "phno":phno,
        "password":password
    }
    db.collection('users').insertOne(data,(err,collection) => {
        if(err){
            throw err;
        }
        console.log("Record Inserted Succesfully")
    })
    return res.redirect('reg_successful.html')
})

app.post("/login", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    db.collection('users').findOne({ email: email, password: password }, (err, user) => {
        if (err) {
            return res.status(500).send("Error occurred while logging in");
        }
        if (!user) {
            return res.redirect('/login.html?error=Invalid gmail id or password'); // Redirect back to login if not found
        }
        return res.redirect('Maps.html'); // Create this page to show after successful login
    });
});

app.get("/",(req,res) => {
    res.set({
        "Allow-acces-Allow-Origin":'*'
    })
    return res.redirect('home.html')
}).listen(3000);

console.log("Listening on port 3000")