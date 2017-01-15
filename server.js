const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();
//To use partials parts of hbs.
hbs.registerPartials(__dirname + '/views/partials');
//Necessary to make express known about the view engine that we want to use.
app.set('view engine', 'hbs');

//app.use is the way to register a midleware
//next: exist to tell express when your midleware function is done.
app.use(function (req, res, next) {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log');
    }
  });
  next();
});


//Defining a render for maintenance.hbs
app.use((req, res, next) => {
  res.render('maintenance.hbs');
});

//Midleware to set static directories.
//__direname -> give you the complete path
app.use(express.static(__dirname + '/public'));

//Hbs helper for date
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

//Getter, with url as first parameter and function of second parameter
//Function will have a request and response as parameters.
// Localhost:3000
app.get('/', (req, res) => {

 res.render('home.hbs', {
   pageTitle: 'Home Page',
   messagePage: 'Lorem ipsum'
 });

  //Respond of a html file.
  // res.send('<h1>Hello express</h1>');

  // //Respond of a Json file.
  // res.send({
  //   name: 'Ivan',
  //   likes: [
  //     'MMA',
  //     'Traveling'
  //   ]
  // });
});

// localhost:3000/about --> we will get this respond.
app.get('/about', function(req, res) {
  //The second parameter is the object with the dynamic variables to use in the hbs file.
  res.render('about.hbs', {
    pageTitle: 'About Page'
    });
});

// /bad -> send back json with errorMessage
app.get('/bad', function(req, res) {
  res.send({
    errorMessage : 'Unable to handle request'
  });
});

//app listen in port 3000
app.listen(3000, function() {
  console.log('Server is up on port 3000');
});
