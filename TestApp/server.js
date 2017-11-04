const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// Connect To Database
mongoose.connect(config.database);

// On Connection
mongoose.connection.on('connected', () => {
  console.log('Connected to database '+config.database);
});

// On Error
mongoose.connection.on('error', (err) => {
  console.log('Database error: '+err);
});

const app = express();

const users = require('./routes/users');

// Port Number
const port = 3000;

// Set Static Folder
app.use(express.static(__dirname + "/public"));

// Body Parser Middleware
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

//require('./config/passport')(passport);

app.use('/users', users);

// Index Route
app.get('/', (req, res) => {
  res.send('Invalid Endpoint');
});

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '/public/index.html'))
// });

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/register.html'))
})

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/login.html'))
})

app.get('/2fa', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/2fa.html'))
})

app.get('/twoFactorSetup', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/twoFactorSetup.html'))
})

app.post('/twoFactorSetup', function(req, res){
    console.log("HERE")
    const secret = speakeasy.generateSecret({length: 10});
    QRCode.toDataURL(secret.otpauth_url, (err, data_url)=>{
        //save to logged in user.
        // user.twofactor = {
        //     secret: "",
        //     tempSecret: secret.base32,
        //     dataURL: data_url,
        //     otpURL: secret.otpauth_url
        // };
        return res.json({
            message: 'Verify OTP',
            tempSecret: secret.base32,
            dataURL: data_url,
            otpURL: secret.otpauth_url
        });
    });
});

// Start Server
app.listen(port, () => {
  console.log('Server started on port '+port);
});
