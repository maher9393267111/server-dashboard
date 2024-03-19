var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');
var dotenv = require('dotenv');

// const { findDocument } = require('./helpers/MongoDbHelper');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const { Server } = require('socket.io');
const { socketOrder } = require('./helpers/socket');
const { init } = require('./helpers'); 

const Employee = require('./models/employee');
const jwtSettings = require('./constants/jwtSettings');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const uploadRoute = require('./routes/upload');
const loginRoute = require('./routes/login');

const customersRoute = require('./routes/customers');
const employeesRoute = require('./routes/employees');

const notificationsRoute = require('./routes/notifications');

dotenv.config({ path: '.env' });
mongoose.connect(
    //'mongodb+srv://maher:maher9326@cluster0.nf63j.mongodb.net/theme?retryWrites=true&w=majority',
    'mongodb+srv://hamad:hamadhamad@acaserverlessinstance.lxbny28.mongodb.net/first?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
        if (err) {
            console.log('Error connecting to MongoDB');
        } else {
            console.log('Connected to MongoDB');
        }
    },
);

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

        //  findDocument
        Employee.findById(_id)
            .then((result) => {
                if (result) {
                    // console.log("resul passport  ☀️  ☀️  ☀️" , result)
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
app.use('/upload', uploadRoute);
app.use('/notifications', notificationsRoute);
app.use('/auth', loginRoute);

app.use('/customers', customersRoute);
app.use('/employees', employeesRoute);

app.use('/public', express.static('public'));

app.get('/', (req, res) =>
    res.status(200).json({
        message: 'HELLOSERVER',
    }),
);

const port = process.env.PORT || '3300';

const server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});



init(server);


//   const io = new Server(server, {
//     cors: {
//         origin: '*',
//         Credentials: true,
//         methods: ['GET', 'POST'],
//     },

//     transports: ['polling', 'websocket'],
// 	allowEIO3: true

// });



// io.on('connection', (socket) => {
//     //let io = socket
//     socket.emit('start', 'START');

//    // app.set('socket', socket);
//     //socketOrder(socket);


 
// });






//app.set('socketio', io);
//socketOrder(io);










// app.use(function (req, res, next) {
//     req.socket = io;
//     next();
//   });



// io.engine.on('connection_error', (err) => {
//     console.log(err.req); // the request object
//     console.log(err.code); // the error code, for example 1
//     console.log(err.message); // the error message, for example "Session ID unknown"
//     console.log(err.context); // some additional error context
// });

// io.use((socket, next) => {
//     next();
//   });

// app.use(passport.initialize());
//   app.use(passport.session());

// Authenticate before establishing a socket connection

// app.use(function (req, res, next) {
//     req.io = io;
//     next();
//   });

module.exports = app ;
