var express = require('express');
var router = express.Router();
var Player = require('../models/playerSchema');

router.get('/', function (req, res) {
  Player.find({}, function (err, players) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    res.send(players);
  });
});

router.post('/', function (req, res) {
  var player = new Player(req.body);
  player.save(function (err) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    res.sendStatus(201);
  });
});

router.put('/:id', function (req, res) {
  Player.findByIdAndUpdate(req.params.id, req.body, function (err, player) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    res.status(204).send(player);
  });
});

router.delete('/:id', function (req, res) {
  Player.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    res.sendStatus(204);
  });
});

module.exports = router;
