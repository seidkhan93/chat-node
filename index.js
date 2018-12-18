const express = require('express');

const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);

const bodyParser = require('body-parser');

const data = [];

const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/views'));

app.get('/', function(req, res) {
	res.render('index.html');
});

// Messages
app.get('/message', function(req, res) {
	res.status(200).send(data);
});

app.post('/message', function(req, res) {
	data.push(req.body.message);
	res.status(200).send(data);
});

io.on('connection', function(socket){
	data.push({ message: 'New User connected! '});
	io.emit('user', { messages: data });

	socket.on('message', function(req){
	  data.push(req);

	  io.emit('broadcast', { messages: data });
	});
});

http.listen(port, function(){
  console.log(`listening on ${port}`);
});
