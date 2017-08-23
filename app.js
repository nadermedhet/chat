var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

var mongo = require('mongodb').MongoClient;
var client = require('socket.io').listen(8080).sockets;

mongo.connect('mongodb://nader:nader100@ds033047.mlab.com:33047/chat', (err, db) => {
    if (err) throw err;

    client.on('connection', (socket) => {
        var col = db.collection('messages');
        var whiteSpacePattern = /^\s*$/;

        var sendst = function(s){
            socket.emit('status', s);
        }


        col.find().limit(100).sort({_id:1}).toArray( (err , res)=>{
            if (err) throw err;
            socket.emit('output' , res)

        })


        socket.on('input', data => {
            var name = data.name;
            var message = data.message;
            if( whiteSpacePattern.test(name) || whiteSpacePattern.test(message)){

                    sendst('name and message is require ')
            }else{

                col.insert({name : name , message : message} , ()=>{
                    client.emit('output' , [data])
                    sendst({
                        message : ' message is sent ',
                        clear : true
                    })
                })

            }
           

        })
    });

})
module.exports = app;
