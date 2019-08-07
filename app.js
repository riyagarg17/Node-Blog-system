const express=require('express');
const path=require('path');
const multer = require('multer');
const methodOverride=require('method-override');
const exphbs=require('express-handlebars');
const mongoose=require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport=require('passport');

require('dotenv').config();

const app=express();

//flash middleware
app.use(flash());

//express-session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }));

  //method-override middleware
app.use(methodOverride('_method'));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//bodyParser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//custom middleware
app.use(function(req,res,next){
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.user=req.user || null;
    res.locals.error = req.flash('error');
    next();
});
//handlebar helpers
const {truncate,stripTags,formatDate,select,editIcon}=require('./helper/hbs');

//load handlebars middleware
app.engine('handlebars',exphbs({
    helpers:{
        truncate:truncate,
        stripTags:stripTags,
        formatDate:formatDate,
        select:select,
        editIcon:editIcon
    },
    defaultLayout:'main'}));
app.set('view engine','handlebars');

//set static folder
app.use(express.static(path.join(__dirname,'public')));

//load user model
require('./models/user');

//load stories model
require('./models/story');

//passport config
require('./config/passport')(passport);

//load keys
const keys=require('./config/keys');

//load routes
const auth=require('./routes/auth');
const index=require('./routes/index');
const stories=require('./routes/stories');

//connect to mongoose
mongoose.connect(keys.mongoURI,{ useNewUrlParser: true })
.then(()=>console.log('MongoDB connected'))
.catch((err)=>console.log(err));

//use routes
app.use('/auth',auth);
app.use('/',index);
app.use('/stories',stories);

const port=process.env.PORT || 8000;

app.listen(port,()=>{
    console.log(`listening on port ${port}`);
});