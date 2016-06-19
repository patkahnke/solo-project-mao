//dependencies
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// modules
var playersDB = require('./routes/players');
var index = require('./routes/index');
var Game = require('./modules/game');
var Table = require('./modules/table');
var Player = require('./modules/player');
var Gameplay = require('./modules/gameplay');
var Utility = require('./modules/utility');
var Rule = require('./modules/rule');

//global game setup variables
var table = new Table();
var game = new Game();
var gameplay = new Gameplay();
var utility = new Utility();
var rule = new Rule();
var players = table.players;
var deck = game.deck;
var prototypeVariables = {
  table: table,
  game: game,
  gameplay: gameplay,
  utility: utility,
  rule: rule,
  io: io,
};

//socket.io functions
io.on('connection', function (socket) {
  console.log('user connected');

  socket.on('playerLoggedIn', function (data) {
    var player = new Player(socket.id);
    table.seatNewPlayers(socket, players, data, deck, player, prototypeVariables);
  });

  socket.on('chat message', function (msg) {
    io.emit('chat message', msg);
  });

  socket.on('stage card', function (data) {
    gameplay.stageCard(data, prototypeVariables);
    gameplay.assessCard(data, prototypeVariables);
  });

});

// middleware
app.use(express.static(path.join(__dirname, './public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// express routes
app.use('/players', playersDB);
app.use('/', index);

// mongoose connection
var databaseURI = 'mongodb://localhost:27017/mao';

mongoose.connect(databaseURI);

mongoose.connection.on('connected', function () {
  console.log('Mongoose connection open ', databaseURI);
});

mongoose.connection.on('error', function (err) {
  console.log('Mongoose error connecting ', err);
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});
