if (process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}



var express = require('express');
var app = express();
const bcrypt = require('bcrypt')
const passport = require('passport')

const flash = require('express-flash')
const session = require ('express-session')

const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

const users = [] 
// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended:false}))
app.use(flash())
app.use(session({
  secret: process.env.session_secret,
  resave: false,
  saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())

// use res.render to load up an ejs view file

// index page
app.get('/', function(req, res) {
  res.render('pages/index' )
})

// login page
app.get('/login', function(req, res) {
  res.render('pages/login');
});


// login page post
app.post('/login',passport.authenticate('local', {
successRedirect:'/',
failureRedirect:'/login',
failureFlash:true

  }
));

// about page
app.get('/about', function(req, res) {
  res.render('pages/about');
});


// register page
app.get('/register', function(req, res) {
  res.render('pages/register');
});



// register page post
app.post('/register', async function(req, res) {
  try{
    const hashedPassword = await bcrypt.hash(req.body.password,10)
    users.push({
      id:Date.now().toString(),
      name: req.body.name,
      email:req.body.email,
      password:hashedPassword
    })
    res.redirect('/login')
  }catch {
res.redirect('/register')
  }

  console.log(users)
});



app.listen(8080);
console.log('Server is listening on port 8080');

