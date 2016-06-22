//modules
var Utility = require('./utility');

//game play variables
var utility = new Utility();
var tableReady = false;
var directionLeft = true;
var directionChangeCount = utility.randomNumber(5, 12);
var playCount = 1;
var timeoutIDReset = '';

function Gameplay() {};

//deal a specified number of cards from the pack of cards,
Gameplay.prototype.dealCards = function (deck, numberOfCards, hand, maxCards) {
  if (hand.length < maxCards) {
    for (var i = 0; i < numberOfCards; i++) {
      hand.push(deck.shift());
    };
  };

  return hand;
};

//stage a card for one second before the next function fires
Gameplay.prototype.stageCard = function (data, prototypeVariables) {
  var io = prototypeVariables.io;
  console.log('data.table', data.table);
  var tableID = data.table.tableID;
  io.in(tableID).emit('stage card client', data);
};

//play a specific card, chosen from the hand, onto the table
Gameplay.prototype.playCard = function (hand, table) {
  var playedCard = hand.pop();
  table.cardsOnTable.push(playedCard);
  return hand;
};

//player who gets rid of all cards first wins
Gameplay.prototype.lastCard = function (hand) {
  if (hand.length == 0) {
    return true;
  } else {
    return false;
  }
};

Gameplay.prototype.endGame = function (players, io, tableID) {
  io.in(tableID).emit('game over', players);
};

//select the first card from the deck as the beginning "play" card
Gameplay.prototype.setUpTargetCard = function (tableData, deck, prototypeVariables) {
  var table = tableData;
  var startTargetCard = deck.splice(0, 1).toString();
  table.cardsOnTable.push(startTargetCard);
  return startTargetCard;
};

//find the current "play" card in the center of the table
Gameplay.prototype.currentTargetCard = function (table) {
  var targetCard = table.cardsOnTable[table.cardsOnTable.length - 1];
  console.log('table.cardsOnTable insode currentTargetCard:', table.cardsOnTable);
  return targetCard;
};

// Game.prototype.getRules = function (rule1, rule2) {
//   rules = { rule1: rule1, rule2: rule2 };
//   return rules;
// };

//check to see if a selected card in the hand is legal to play
Gameplay.prototype.isCardLegal = function (card, targetCard, rule) {
    var targetCard = targetCard;
    var cardNumber = parseInt(card);
    var cardSuit = card.charAt(card.length - 1);
    var targetCardNumber = parseInt(targetCard);
    var targetCardSuit = targetCard.charAt(targetCard.length - 1);
    var isLegal = false;
    var suitRule = rule.suitsMatch(cardNumber, cardSuit, targetCardNumber, targetCardSuit);
    var numberRule = rule.numbersMatch(cardNumber, cardSuit, targetCardNumber, targetCardSuit);
    if (suitRule || numberRule) {
      isLegal = true;
    };

    return isLegal;
  };

Gameplay.prototype.controlDirection = function (playCount, directionChangeCount, directionLeft) {
    if (playCount % directionChangeCount == 0) {
      directionLeft = !directionLeft;
    }

    return directionLeft;
  };

Gameplay.prototype.assessCard = function (data, prototypeVariables) {
      resetTimeout(timeoutIDReset);
      var stringArray = data.stringArray;
      var indexOfStagedPlayer = data.indexOfStagedPlayer;
      var playedCard = data.stringArray[data.stringArray.length - 1];
      console.log('playedCard', playedCard);
      var io = prototypeVariables.io;
      var table = data.table;
      var rule = prototypeVariables.rule;
      var gameplay = prototypeVariables.gameplay;
      var game = prototypeVariables.game;
      var deck = game.deck;
      var players = data.players;
      if (stringArray.length > 1) {
        var targetCard = stringArray[stringArray.length - 2];
      } else {
        var targetCard = gameplay.currentTargetCard(table);
      };

      var stringRule = rule.stringNumbers(playedCard, targetCard);
      var legal = gameplay.isCardLegal(playedCard, targetCard, rule);
      var tableID = table.tableID;
      if (players[indexOfStagedPlayer].turn) {
        if (stringRule) {
          console.log('string array:', stringArray);
          io.in(tableID).emit('mao good message', 'Mao: ' + players[indexOfStagedPlayer].nickname +
          ' has 1 second to add to string');
          players[indexOfStagedPlayer].hand.push(playedCard);
          players[indexOfStagedPlayer].hand = gameplay.playCard(players[indexOfStagedPlayer].hand, table);
          var targetCard = gameplay.currentTargetCard(table);
          var timeoutID = setTimeout(stringCard, 1500, table, data, prototypeVariables, stringArray);
          timeoutIDReset = timeoutID;
        } else if (legal) {
          players[indexOfStagedPlayer].turn = false;
          var timeoutID = setTimeout(legalCard, 1500, table, data, prototypeVariables);
        } else {
          players[indexOfStagedPlayer].turn = false;
          var timeoutID = setTimeout(illegalCard, 1500, table, data, prototypeVariables);
        }

      } else {
        players[indexOfStagedPlayer].hand.push(data.assessedCard);
        players[indexOfStagedPlayer].hand = gameplay.dealCards(deck, 1, players[indexOfStagedPlayer].hand, players[indexOfStagedPlayer].maxCards);
        players[indexOfStagedPlayer].cardPenalty += 1;
        io.in(tableID).emit('mao bad turn message', 'Mao: ' + players[indexOfStagedPlayer].nickname +
        ' played out of turn!');
        io.in(tableID).emit('play', { players: players, targetCard: targetCard, stringArray: data.stringArray, table: table });
        io.in(tableID).emit('out of turn player', indexOfStagedPlayer);
      }
    };

function assignTurn(directionLeft, players, data) {
  if (directionLeft) {
    players[data.playerLeftIndex].turn = true;
  } else {
    players[data.playerRightIndex].turn = true;
  }
}

function resetTimeout(timeoutIDReset) {
  clearTimeout(timeoutIDReset);
}

function legalCard(tableData, data, prototypeVariables) {
  var players = data.players;
  var indexOfStagedPlayer = data.indexOfStagedPlayer;
  var table = tableData;
  var gameplay = prototypeVariables.gameplay;
  var game = prototypeVariables.game;
  var io = prototypeVariables.io;
  var stringScore = 0;
  var targetCard = '';
  var lastCard = '';
  var tableID = table.tableID;
  players[indexOfStagedPlayer].hand.push(data.assessedCard);
  players[indexOfStagedPlayer].hand = gameplay.playCard(players[indexOfStagedPlayer].hand, table);
  targetCard = gameplay.currentTargetCard(table);
  lastCard = gameplay.lastCard(players[indexOfStagedPlayer].hand);
  playCount++;
  directionLeft = gameplay.controlDirection(playCount, directionChangeCount, directionLeft);
  console.log('playCOunt and directionchangeCount inside legalCard', playCount, directionChangeCount);
  assignTurn(directionLeft, players, data);
  console.log('data inside legalCard:', data);
  if (data.stringArray.length > 1) {
    for (var i = 0; i < data.stringArray.length; i++) {
      players[indexOfStagedPlayer].stringScore += (i + 1) * 10;
    }

    players[indexOfStagedPlayer].stringScore += stringScore;
  } else {
    players[indexOfStagedPlayer].cardScore += 10;
  };

  data.stringArray = [];
  io.in(tableID).emit('mao good message', 'Mao: ' + players[indexOfStagedPlayer].nickname +
' played a legal card');
  io.in(tableID).emit('play', { players: players, targetCard: targetCard, stringArray: data.stringArray, table: table });
  if (lastCard) {
    gameplay.endGame(players, io, tableID);
    return;
  }
};

function illegalCard(tableData, data, prototypeVariables) {
  var players = data.players;
  var indexOfStagedPlayer = data.indexOfStagedPlayer;
  var table = tableData;
  var gameplay = prototypeVariables.gameplay;
  var game = prototypeVariables.game;
  var io = prototypeVariables.io;
  var deck = game.deck;
  var targetCard = '';
  var tableID = table.tableID;
  targetCard = gameplay.currentTargetCard(table);
  playCount++;
  directionLeft = gameplay.controlDirection(playCount, directionChangeCount, directionLeft);
  console.log('playCOunt and directionchangeCount inside illegalCard', playCount, directionChangeCount);
  assignTurn(directionLeft, players, data);
  if (data.stringArray.length > 1) {
    for (var i = 0; i < data.stringArray.length; i++) {
      players[indexOfStagedPlayer].stringScore += (i + 1) * 10;
    }
  } else {
    console.log('else statement is working. data.stringArray =', data.stringArray);
  };

  data.stringArray = [];
  players[indexOfStagedPlayer].hand.push(data.assessedCard);
  players[indexOfStagedPlayer].hand = gameplay.dealCards(deck, 1, players[indexOfStagedPlayer].hand, players[indexOfStagedPlayer].maxCards);
  players[indexOfStagedPlayer].cardPenalty += 1;
  io.in(tableID).emit('mao bad card message', 'Mao: ' + players[indexOfStagedPlayer].nickname +
' played an illegal card');
  io.in(tableID).emit('play', { players: players, targetCard: targetCard, stringArray: data.stringArray, table: table });
}

function stringCard(tableData, data, prototypeVariables, tempStringArray) {
  var players = data.players;
  var indexOfStagedPlayer = data.indexOfStagedPlayer;
  var table = tableData;
  var gameplay = prototypeVariables.gameplay;
  var game = prototypeVariables.game;
  var io = prototypeVariables.io;
  var assessedCard = data.assessedCard;
  var targetCard = '';
  var tableID = table.tableID;
  targetCard = gameplay.currentTargetCard(table);
  players[indexOfStagedPlayer].turn = false;
  var lastCard = gameplay.lastCard(players[indexOfStagedPlayer].hand);
  playCount++;
  directionLeft = gameplay.controlDirection(playCount, directionChangeCount, directionLeft);
  console.log('playCOunt and directionchangeCount inside stringCard', playCount, directionChangeCount);
  assignTurn(directionLeft, players, data);
  if (data.stringArray.length > 1) {
    for (var i = 0; i < data.stringArray.length; i++) {
      players[indexOfStagedPlayer].stringScore += (i + 1) * 10;
    }
  } else {
    players[indexOfStagedPlayer].cardScore += 10;
  };

  data.stringArray = [];
  io.in(tableID).emit('play', { players: players, targetCard: targetCard, stringArray: data.stringArray, table: table });
  if (lastCard) {
    gameplay.endGame(players, io, table);
    return;
  }
};

module.exports = Gameplay;
