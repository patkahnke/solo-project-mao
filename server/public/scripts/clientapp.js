$(document).ready(function () {
  var socket = io();
  var player = {};
  var hand = [];
  var newPlayer = {};
  var playerLeft = {};
  var playerRight = {};
  var playerIndex = undefined;
  var playerLeftIndex = undefined;
  var playerRightIndex = undefined;
  var stringArray = [];
  var tableID = '';

  //listeners
  //player input listener
  $('#player-input-button').on('click', function () {
    setUpPlayer(event);
    socket.emit('playerLoggedIn', { nickname: newPlayer.nickname });
  });

  //chat listener
  $('form').submit(function () {
    socket.emit('chat message', { msg: player.nickname + ': ' + $('#m').val(), tableID: tableID });
    $('#m').val('');
    return false;
  });

  //card listener
  // $('.card' + key).click(function () {
  //     stageCard(key, value, players, playerIndex);
  //     return false;
  //   });

  //socket events
  socket.on('get player index', function (data) {
    playerIndex = data.playerIndex;
    tableID = data.tableID;
    console.log('playerIndex:', playerIndex);
  });

  socket.on('play', function (data) {
    clearOutCards();
    appendCardsToDOM(data);
    console.log('data inside play', data);
    $('.dealer-card-border').hide();
    $('.dealer-card-border').fadeIn(100);
  });

  socket.on('game over', function (players) {
    clearOutCards();
    $('.communication').append('<h1>GAME OVER</h1><br><p>' + players[0].nickname + ' has ' +
    players[0].hand.length + ' card(s) remaining.\nCard Points: ' + players[0].cardScore + '\nString Points: '
    + players[0].stringScore + '\nPenalties Taken: ' + players[0].cardPenalty + '</p><br><p>' + players[1].nickname + ' has ' +
    players[1].hand.length + ' card(s) remaining.\nCard Points: ' + players[1].cardScore + '\nString Points: '
    + players[1].stringScore + '\nPenalties Taken: ' + players[1].cardPenalty + '</p><br><p>' + players[2].nickname + ' has ' +
    players[2].hand.length + ' card(s) remaining.\nCard Points: ' + players[2].cardScore + '\nString Points: '
    + players[2].stringScore + '\nPenalties Taken: ' + players[2].cardPenalty);
  });

  socket.on('stage card client', function (data) {
    stageCard(data);
  });

  socket.on('chat message', function (msg) {
    $('#messages').prepend($('<li class="chat-message">').text(msg));
  });

  socket.on('mao good message', function (msg) {
    $('#messages').prepend($('<li class="chat-message mao-good">').text(msg));
  });

  socket.on('mao bad card message', function (msg) {
    $('#messages').prepend($('<li class="chat-message mao-bad-card">').text(msg));
  });

  socket.on('mao bad turn message', function (msg) {
    $('#messages').prepend($('<li class="chat-message mao-bad-turn">').text(msg));
  });

  socket.on('out of turn player', function (data) {
    $('.playerIndex' + data).append('<div class="out-of-turn">PLAYED OUT OF TURN</div>');
  });

  //create new player in database
  function setUpPlayer(event) {
    event.preventDefault();

    $.each($('#player-input-form').serializeArray(), function (i, field) {
        newPlayer[field.name] = field.value;
      });

    $('#player-input-form').children().val('');
    $('#player-input-form').hide();
    $.post('/players', newPlayer);
    return newPlayer;
  }

  function clearOutCards() {
    $('.mao-photo').hide();
    $('.table').empty();
    $('.dealer-card').empty();
    $('#hand').empty();
    $('.player-left-name').empty();
    $('.player-right-name').empty();
    $('.playerIndex' + playerIndex).remove();
    $('.player-left-card').empty();
    $('.player-right-card').empty();
    $('.main-player').empty();
  }

  function setPlaceAtTable(data) {
    playerLeftIndex = getPlayerLeftIndex(playerIndex);
    playerRightIndex = getPlayerRightIndex(playerIndex);
    var placeAtTable = {
      playerLeftIndex: playerLeftIndex,
      playerRightIndex: playerRightIndex,
    };
    return placeAtTable;
  }

  function getPlayerLeftIndex(playerIndex) {
    switch (playerIndex) {
    case 0: return 1;
    case 1: return 2;
    case 2: return 0;
  }
  }

  function getPlayerRightIndex(playerIndex) {
    switch (playerIndex) {
    case 0: return 2;
    case 1: return 0;
    case 2: return 1;
  }
  }

  function stageCard(data) {
    var playedCard = data.value;
    var index = data.indexOfStagedPlayer;
    var players = data.players;
    clearOutCards();
    appendCardsToDOM(data);
    appendStageCard(playedCard, players, index);
  }

  function appendStageCard(playedCard, players, index) {
    $('.playerIndex' + index).append('<img width=100 class="card-border" src=cardImages/'
    + playedCard + '.png>');
    $('.card-border').fadeIn(100);
    $('.playerIndex' + playerIndex).children().removeClass('card-border').addClass('player-card-border');
  }

  function appendCardsToDOM(data) {
    var table = data.table;
    console.log('data.table inside appendCards', data.table);
    var pixel = -60;
    players = data.players;
    targetCard = data.targetCard;
    player = players[playerIndex];
    var indexOfStagedPlayer = playerIndex;
    console.log('player.hand before sort', player.hand);
    player.hand = sortHand(player.hand);
    console.log('player.hand after sort', player.hand);
    hand = player.hand;
    var placeAtTable = setPlaceAtTable(data);
    playerLeft = data.players[placeAtTable.playerLeftIndex];
    playerRight = data.players[placeAtTable.playerRightIndex];
    $('.dealer-card').text('Dealer');
    $('.table').append('<img width=100 class="dealer-card-border" src=cardImages/' + data.targetCard + '.png>');
    $('.player-left-name').append('<h1>' + playerLeft.nickname + '</h1>');
    $('.player-left-name').append('<img width=180 src=cardImages/playing-card-backs-1.jpg>');
    $('.player-left-name').append('<h2>Cards Left: ' + playerLeft.hand.length + '</h2>');
    $('.player-left-card').append('<div class="playerIndex' + playerLeftIndex + '"</div>');
    $('.player-right-name').append('<h1>' + playerRight.nickname + '</h1>');
    $('.player-right-name').append('<img width=180 src=cardImages/playing-card-backs-1.jpg>');
    $('.player-right-name').append('<h2>Cards Left: ' + playerRight.hand.length + '</h2>');
    $('.player-right-card').append('<div class="playerIndex' + playerRightIndex + '" ></div>');
    $('.main-player').text(player.nickname);
    $('.staging-area').append('<div class="playerIndex' + playerIndex + '" ></div>');
    $.each(hand, function (key, value) {
      var index = key + 1;
      $('#hand').append('<button class="card' + key + '" style="margin-top:2px; margin-left: '
      + pixel + 'px; float: left; z-index: ' + index + '"><img class=card"' + key +
      ' width=100" src=cardImages/' + value + '.png /></button>');
      $('.card' + key).click(function () {
          var assessedCard = hand.splice(key, 1).toString();
          stringArray = data.stringArray;
          stringArray.push(assessedCard);
          socket.emit('stage card', {
            table: table,
            key: key,
            value: value,
            indexOfStagedPlayer: indexOfStagedPlayer,
            players: players,
            targetCard: targetCard,
            assessedCard: assessedCard,
            stringArray: stringArray,
            playerLeftIndex: playerLeftIndex,
            playerRightIndex: playerRightIndex,
          });
          return false;
        });
    });
  }

  function sortHand(hand) {
    var tempHandSpade = [];
    var tempHandDiamond = [];
    var tempHandClub = [];
    var tempHandHeart = [];
    var movedCard = '';
    while (hand.length > 0) {
      var card = hand[0];
        console.log('hand', hand);
      if (card.charAt(card.length - 1) === 'S') {
        movedCard = hand.shift().toString();
        console.log('movedCard', movedCard);
        tempHandSpade.push(movedCard);
        console.log('spades', tempHandSpade);
      } else if (card.charAt(card.length - 1) === 'D') {
        movedCard = hand.shift().toString();
        console.log('movedCard', movedCard);
        tempHandDiamond.push(movedCard);
        console.log('diamonds', tempHandDiamond);
      } else if (card.charAt(card.length - 1) === 'C') {
        movedCard = hand.shift().toString();
        console.log('movedCard', movedCard);
        tempHandClub.push(movedCard);
        console.log('clubs', tempHandClub);
      } else {
        movedCard = hand.shift().toString();
        console.log('movedCard', movedCard);
        tempHandHeart.push(movedCard);
        console.log('heart', tempHandHeart);
      };
    };

    while (tempHandSpade.length > 0) {
      sortCards(tempHandSpade, hand, card);
    };

    while (tempHandDiamond.length > 0) {
      sortCards(tempHandDiamond, hand, card);
    };

    while (tempHandClub.length > 0) {
      sortCards(tempHandClub, hand, card);
    };

    while (tempHandHeart.length > 0) {
      sortCards(tempHandHeart, hand);
    };

    return hand;
  }

  function sortCards(tempHand, hand) {
    while (tempHand.length > 0) {
      for (var j = 1; j < 14; j++) {
        for (var i = 0; i < tempHand.length; i++) {
          var cardNumber = parseInt(tempHand[i]);
          if (cardNumber == j) {
            var card = tempHand.splice(i, 1).toString();
            hand.push(card);
          };
        };
      };
    };
  }

});
