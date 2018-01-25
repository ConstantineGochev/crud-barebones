const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;
//how middleware works
//app.use((req,res,next) => {
   // console.log(Date.now());
   // req.name = 'C.G'
   // next();
//})
// get rid of warning
mongoose.Promise = global.Promise;
// connect to mongoose
mongoose.connect('mongodb://localhost/yachts', {
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
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//load model of yachts
require('./models/yachts');

const Yacht = mongoose.model('yachts');

// INdex route
app.get('/', (req, res) => {
    const name = 'Yacht owner'
    res.render('index', {
        name:name
    });

});
app.get('/info', (req, res) => {
    res.render('info');
})

app.get('/yachts', (req, res) => {
    res.render('yachts');
})

app.get('/yachts/add', (req, res) => {
    res.render('yachts/add');
})

//post request
app.post('/yachts', (req, res) => {
    console.log(req.body)
    res.send('ok')
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})