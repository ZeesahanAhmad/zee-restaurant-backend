var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session=require('express-session');
const fileStore=require('session-file-store')(session);
const mongoose=require('mongoose');
const url=" mongodb://127.0.0.1:27017/ZeeRestaurant";


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var leaderRouter = require('./routes/leaderRouter');
var promoRouter = require('./routes/promoRouter');



var app = express();
const connect=mongoose.connect(url,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

connect.then(db=>{
  console.log("mongodb connected successfully!");
},err=>next(err))
.catch(err=>console.log("error in mongodb connection: "+err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
  name:"session-id",
  secret:"1234-5432-8765",
  saveUninitialized:false,
  resave:false,
  store:new fileStore()

}));

const auth=(req, res, next)=>{
  if(!req.session.user){
    const  authHeader=req.headers.authorization;
      if(!authHeader){
         var err=new Error("You are not authenticated!");
         res.setHeader('WWW-Authenticate','Basic');
         err.status=401;
         next(err);
         return;
       }
       var auth=new Buffer.from(authHeader.split(' ')[1],'base64').toString().split(':');
       const username=auth[0];
       const password=auth[1];
 
      if(username=='admin' && password=='password'){
        req.session.user='admin';
        next();
       }
      else{
        var err=new Error("You are not authenticated!");
        res.setHeader('WWW-Authenticate','Basic');
        err.status=401;
        next(err);
      }
 
  }
  else{
    if(req.session.user==='admin'){
        next();
    }
    else{
        var err=new Error('You are not authenticated!');
        err.status=401;
        next(err);
    }

  }
  
}
app.use(auth);
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/leaders', leaderRouter);
app.use('/promotions', promoRouter);





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
