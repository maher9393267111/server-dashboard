var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');
var dotenv = require('dotenv');

const { findDocument } = require('./helpers/MongoDbHelper');
const jwt = require('jsonwebtoken');
const passport = require('passport');


const { Server } = require('socket.io');
const {socketOrder} = require('./helpers/socket')



const jwtSettings = require('./constants/jwtSettings');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
 const uploadRoute = require('./routes/upload');
const loginRoute = require('./routes/login');
const categoriesRoute = require('./routes/categories');
const suppliersRoute = require('./routes/suppliers');
const customersRoute = require('./routes/customers');
const employeesRoute = require('./routes/employees');
const productsRoute = require('./routes/products');
const ordersRoute = require('./routes/orders');
const slidersRoute = require('./routes/sliders');

dotenv.config({ path: '.env' });
mongoose.connect("mongodb+srv://maher:maher9326@cluster0.nf63j.mongodb.net/theme?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) {
        console.log('Error connecting to MongoDB');
    } else {
        console.log('Connected to MongoDB');
    }
});

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// CORS
app.use(cors());

//PASSPORT: BEARER TOKEN
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = jwtSettings.SECRET;

passport.use(
    new JwtStrategy(opts, (payload, done) => {
        const _id = payload.id;
        findDocument(_id, 'employees')
            .then((result) => {
                if (result) {
                  //  console.log("resul passport" , result)
                    return done(null, result);
                } else {
                    return done(null, false);
                }
            })
            .catch((error) => {
                return done(error, false);
            });
    }),
);
//END





//ROUTES
app.use("/upload", uploadRoute);
app.use("/auth", loginRoute);
app.use("/categories", categoriesRoute);
app.use("/suppliers", suppliersRoute);
app.use("/customers", customersRoute);
app.use("/employees", employeesRoute);
app.use("/products", productsRoute);
app.use("/orders", ordersRoute);
app.use("/sliders", slidersRoute);
app.use("/public", express.static("public"));





app.get('/', (req, res) => res.status(200).json({
    
    message:"HELLOSERVER"
  })

);






const port =process.env.PORT || '8000'

const server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})
const io = new Server(server, {
    cors: {
        origin: true,
        Credential: true,
        // origin: baseURLFrontend.baseURLFrontend,
        // methods: ["GET", "POST"]
    }
});



socketOrder(io)











module.exports = app;



// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//     next(createError(404));

// });



// error handler
// app.use(function (err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};

//     // render the error page
//     res.status(err.status || 5000);
// });