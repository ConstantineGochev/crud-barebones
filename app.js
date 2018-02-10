const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const {ensureAuthenticated} = require('./helpers/auth');
const bcrypt = require('bcryptjs');
const async = require('async');
const methodOverride = require('method-override');



//passport require 

const app = express();
const port = process.env.PORT || 5000;
//how middleware works
//app.use((req,res,next) => {
   // console.log(Date.now());
   // req.name = 'C.G'
   // next();
//})
// get rid of warning
mongoose.Promise = global.Promise;


//connect DB
const db = require('./config/database');
// connect to mongoose
mongoose.connect(db.mongoURI, {
    useMongoClient: true
})
    .then(() => {
    console.log('connected to db')
    }).catch(err => {
        console.log(err)
    })

//handlebars middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

//express-session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }))


//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Global variables
app.use(function(req,res,next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})
//console.log(user)

// parse application/json
app.use(bodyParser.json())

//method override middleware
app.use(methodOverride('_method'))

//load model of yachts
require('./models/yachts');
const Yacht = mongoose.model('yachts');

//load user model
require('./models/user');
const User = mongoose.model('users');

// INdex route
app.get('/', (req, res) => {
    const name = 'Yacht owner'
    res.render('index', {
        name:name
    });

});
app.get('/info',ensureAuthenticated, (req, res) => {
    res.render('info');
})

app.get('/yachts',ensureAuthenticated, (req, res) => {
    Yacht.find({user:req.user.id})
    .then(yachts =>{
        res.render('yachts',{
            yachts:yachts,
        });
    });
});



//ADD a yacht
app.get('/yachts/add',ensureAuthenticated, (req, res) => {
//     async.series([function(callback){
//         Yacht.find({yacht:req.yachts}).then(callback)
//     },
//     function(callback){
//         User.find({user:req.users}).then(callback)
//     },
//     function(err, results){
//         console.log(results);
//         console.log(err)
//         res.render('yachts/add',{
//             yachts:results[0],
//             users:results[1],
//         })
//     }
//    ])


    // Yacht.find({yacht:req.yachts})
    // .then(yachts =>{
    //     res.render('yachts/add',{
    //         yachts:yachts,
    //     })
    // })
     User.find({user:req.users})
        .then(users =>{
            res.render('yachts/add',{
                users:users,
            });
            
        })
})

app.get('/yachts/allyachts/allyachts/',ensureAuthenticated, (req,res)=>{
     Yacht.find({yacht:req.yachts})
    .then(yachts =>{
        res.render('yachts/allyachts/allyachts',{
            yachts:yachts,
        })
    })
})

app.get('/yachts/allyachts/edit/:id', (req, res)=>{
    Yacht.findOne({
        _id: req.params.id
    })
    .then(yacht=>{

        res.render('yachts/allyachts/edit',{
            yacht:yacht
        });
    })
})

//EDIT FORM PROCESS

app.put('/yachts/:id',(req,res)=>{
    Yacht.findOne({
        _id: req.params.id
    })
    .then(yacht =>{
        console.log(yacht.name)
        yacht.name = req.body.yachtname,
        yacht.destination = req.body.destination,
        yacht.date = req.body.date,
        yacht.status = req.body.status,
        yacht.user = req.body.user,
        yacht.username = req.body.username,
        yacht.client = req.body.client

        yacht.save()
        .then(yacht =>{
            req.flash('success_msg','You successfully edited a charter')
            res.redirect('/yachts/allyachts/allyachts')
        })
    })
    .catch(err=>{
        console.log(err)
    })
})

//Delete charter process
app.delete('/yachts/:id', (req, res)=>{
    Yacht.remove({_id:req.params.id})
    .then(()=>{
        req.flash('success_msg','You successfully deleted a charter')        
        res.redirect('/yachts/allyachts/allyachts')  
    })
})

//post request make a charter


//test api for platform
// app.get('/test',ensureAuthenticated, (req, res)=>{
//     Yacht.find({yacht:req.yachts})
//     .then(yachts =>{
//         res.render('test',{
//             yachts:yachts,
//         })
//     })
//    console.log(req.yachts)
   
// })

app.post('/yachts', (req, res) => {
    // Yacht.find({yacht:req.yachts})
    // .then(yachts =>{
    //     res.render('yachts/',{
    //         yachts:yachts,
    //     })
    // })
  
   const new_charter = {
       name: req.body.yachtname,
       destination: req.body.destination,
       date: req.body.date,
       status: req.body.status,
       user:req.body.user,
       username: req.body.username,
       client: req.body.client,
       datecreated: req.body.datecreated
   }
   new Yacht(new_charter).save()
   .then(data =>{
      req.flash('success_msg','You successfully added a charter')
      res.redirect('/yachts/allyachts/allyachts')  
   })
   .catch(err=>{
       console.log(err)
   })
})

//post request for login


//static files load
const path= require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/users/login',(req, res)=>{
      res.render('users/login');
})

// get users/regster path then render page

app.get('/yachts/register',(req, res)=>{
    res.render('yachts/register')
    
})

app.post('/yachts/register',(req, res)=>{
    let errors = []
    if(req.body.password != req.body.password2){
        errors.push({text:'Passwords do not match'})
    }
    if(req.body.password.length < 4){
        errors.push({text:'Password must be 4 chars'})
    }
    if(errors.length >0){
        res.render('yachts/register',{
            errors:errors,
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            password2:req.body.password2
            
        })
    }else{
        const new_user = new User({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            password2:req.body.password2
        });
        // bcrypt.genSalt(10, (err, salt)=>{
        //     bcrypt.hash(new_user.password, salt, (err, hash)=>{
        //         if(err) throw err;
        //         new_user.password = hash;
                new_user.save()
                .then(user =>{
                    req.flash('success_msg','The user is now registered.')
                    res.redirect('/')
                })
                .catch(err=>{
                    console.log(err)
                    return
                })
        //     })
        // })
      
    }

})


require('./config/passport')(passport);

app.post('/users/login',(req,res,next)=>{
   // console.log(passport)
    passport.authenticate('local',{
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next);
})

app.get('/users/logout',(req, res)=>{
    req.logout();
    req.flash('success_msg', 'You are logged out.');
    res.redirect('/users/login')
})




app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})