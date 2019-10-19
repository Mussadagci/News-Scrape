// Require our dependencies 
var express = require("express");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");

// set up our port to be either the host's designated port, or 3000
var PORT = process.env.PORT || 3000;

// Instantiate our Express App
var app = express();

// set up an Express router 
var router = express.Router();
// Require our routes file pass our router object
require("./config/routes")(router);

// Designate our public folder as a static directory
app.use(express.static(__dirname + "/public"));

//connect Handlebars to our Express app
app.engine("handlebars", expressHandlebars({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Use bodyParsser in our app
app.use(bodyParser.urlencoded({
    extended: false
}));

// Have every request go through our router middleware
app.use(router);

// if deployed, use the deployed databse. othervise use the local mongoHaadline database
var db = process.env.MONGODB_URI || "mongodb://localhost/mogoHeadlines";
//Connect mongoose to our database
mongoose.connect(db, {useNewUrlParser: true}, function(error){
    // log any errors connecting with mongoose
    if (error){
        console.log(error);
    }
    // or log a success message 
    else{
        console.log("mongoose connection is successful");
    }
});

// Listen on the port
app.listen(PORT, function(){
    console.log("Listening on port:" + PORT);
});