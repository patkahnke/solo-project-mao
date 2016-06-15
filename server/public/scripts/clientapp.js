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

  $('#player-input-button').on('click', function () {
    setUpPlayer(event);
    socket.emit('playerLoggedIn', { nickname: newPlayer.nickname });
  });

  socket.on('getPlayerIndex', function (data) {
    playerIndex = data.playerIndex;
  });

  socket.on('play', function (data) {
    clearOutCards();
    appendCardsToDOM(data);
  });

  socket.on('game over', function (players) {
    clearOutCards();
    $('.communication').append('<h1>GAME OVER</h1><br><h2>' + players[0].nickname + ' has ' +
    players[0].hand.length + ' card(s) remaining.</h2><br><h2>' + players[1].nickname + ' has ' +
    players[1].hand.length + ' card(s) remaining.</h2><br><h2>' + players[2].nickname + ' has ' +
    players[2].hand.length + ' card(s) remaining.</h2>');
  });

  $('form').submit(function () {
    socket.emit('chat message', player.nickname + ': ' + $('#m').val());
    $('#m').val('');
    return false;
  });

  socket.on('chat message', function (msg) {
    $('#messages').prepend($('<li>').text(msg));
  });

  socket.on('mao good message', function (msg) {
    $('#messages').prepend($('<li class="mao-good">').text(msg));
  });

  socket.on('mao bad card message', function (msg) {
    $('#messages').prepend($('<li class="mao-bad-card">').text(msg));
  });

  socket.on('mao bad turn message', function (msg) {
    $('#messages').prepend($('<li class="mao-bad-turn">').text(msg));
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
    $('.table').empty();
    $('.dealer-card').empty();
    $('#hand').empty();
    $('.player-left-name').empty();
    $('.player-right-name').empty();
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

  function stageCard(index, playedCard, players, playerIndex, data) {
    clearOutCards();
    appendCardsToDOM(data);
    appendStageCard(index, playedCard, players, playerIndex);
    socket.emit('stage card', { playedCard: playedCard, index: index, players:
      players, playerIndex: playerIndex, playerLeftIndex: playerLeftIndex,
      playerRightIndex: playerRightIndex, });
  }

  function appendStageCard(index, playedCard, players, playerIndex) {
    $('.staging-area').append('<img width=100 src=cardImages/' + data.playedCard + '.png>');
  }

  function appendCardsToDOM(data) {
    var pixel = 0;
    players = data.players;
    player = players[playerIndex];
    hand = player.hand;
    console.log('player.hand within append cards function ', player.hand);
    var placeAtTable = setPlaceAtTable(data);
    playerLeft = data.players[placeAtTable.playerLeftIndex];
    playerRight = data.players[placeAtTable.playerRightIndex];
    $('.dealer-card').text('Dealer Card');
    $('.table').append('<img width=100 src=cardImages/' + data.targetCard + '.png>');
    $('.player-left-name').text(playerLeft.nickname + ' has '
    + playerLeft.hand.length + ' cards.');
    $('.player-right-name').text(playerRight.nickname + ' has '
    + playerRight.hand.length + ' cards.');
    $('.main-player').text(player.nickname);
    $.each(hand, function (key, value) {
      var index = key + 1;
      $('#hand').append('<button class="card' + key + '" style="margin-top:2px; margin-left: '
      + pixel + 'px; float: left; z-index: ' + index + '"><img class=card"' + key +
      ' width=100" src=cardImages/' + value + '.png /></button>');
      $('.card' + key).click(function () {
          stageCard(key, value, players, playerIndex);
          return false;
        });
    });
  }

});
