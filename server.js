const express = require('express');
const app = express();
var fs = require('fs');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var mongo = 'mongodb://localhost:27017/b05901041';
mongoose.connect(mongo);
var exec = require('child_process').exec;


mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
var Schema = mongoose.Schema;

var usr_schema = new Schema({
    name: String,
    pwd: String,
});

var prob_schema = new Schema({
    name: String,
    prob_id: Number
});

var Usr = mongoose.model('Usr', usr_schema);
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index.ejs');
})

app.get('/sign_up', (req, res) => {
    res.render('sign_up.ejs');
})

app.get('/usr/:name', (req, res) => {
    res.render('usr.ejs', {
        name:req.params.name
    });
})

/*app.get('/prob/:id/:name', (req, res) => {
    if (req.params.id == 0) {
        res.render('probset.ejs',{name:req.params.name});
    } else {
        res.render('prob_' + req.params.id + '.ejs',{name:req.params.name});
    }
})*/

app.get('/prob/:id', (req, res) => {
    if (req.params.id == 0) {
        res.render('probs/probset.ejs');
    } else {
        res.render('probs/prob_' + req.params.id + '.ejs');
    }
})

server.listen(port, () => {
    console.log("Server Started. http://localhost:" + port);
});

io.on('connection', (socket) => {

    socket.on('sign_in', (data) => {
        console.log(data);
        Usr.findOne({ name: data.name }, (err, result) => {
            console.log(result);
            if (result === null) {
                console.log('err');
                socket.emit('err', 'invalid username or password');
            } else {
                console.log(result.pwd);
                if (result.pwd !== data.pwd) {
                    socket.emit('err', 'invalid username or password');
                    return;
                }
                socket.emit('log_in', data);
            }
        })
    })

    socket.on('sign_up', (data) => {
        Usr.findOne({ name: data.name }, (err, result) => {
            console.log(result);
            if (result === null) {
                var usr = new Usr({ name: data.name, pwd: data.pwd, ac: 0 });
                usr.save((err, res) => {
                    if (err) console.log(err);
                    else console.log(res);
                });
                socket.emit('log_in', data);
            } else {
                socket.emit('err', 'username already exist');
            }
        })
    })

    socket.on('submit', (data) => {
        console.log(data);
        fs.writeFileSync('main.cpp', data.src);
        var command = './judge.sh ' + data.id;
        console.log(command);
        exec(command);
        let judge_1 = fs.readFileSync('result_1', 'utf-8');
        let judge_2 = fs.readFileSync('result_2', 'utf-8');
        console.log(judge_1);
        if (judge_1 == '') {
            console.log('ac');
            var result_1 = 'ac';
        } else {
            result_1 = 'wa';
        }
        if (judge_2 == '') {
            console.log('ac');
            var result_2 = 'ac';
        } else {
            result_2 = 'wa';
        }
        let result = {
            id: data.id,
            result_1: result_1,
            result_2: result_2
        };
        socket.emit('result', result);
        console.log(result);
    })
})