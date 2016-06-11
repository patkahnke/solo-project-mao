var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlayerSchema = new Schema({
  nickname: { type: String, required: true },
  total_games: Number,
  total_wins: Number,
  total_losses: Number,
});

var Player = mongoose.model('Player', PlayerSchema);

module.exports = Player;
