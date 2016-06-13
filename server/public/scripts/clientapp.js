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
    console.log('socket.on play is firing');
  });

  $('form').submit(function () {
    socket.emit('chat message', player.nickname + ': ' + $('#m').val());
    $('#m').val('');
    return false;
  });

  socket.on('chat message', function (msg) {
    $('#messages').append($('<li>').text(msg));
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
    $('#table').text('');
    //$('#hand').text('');
    $('#hand').empty();
    console.log('clearOutCards is firing');
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

  function playCard(index, playedCard, players, playerIndex) {
    socket.emit('playCard', { playedCard: playedCard, index: index, players:
      players, playerIndex: playerIndex, playerLeftIndex: playerLeftIndex,
      playerRightIndex: playerRightIndex, });
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
    $('#table').append('<img width=100 src=cardImages/' + data.targetCard + '.png>');
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
          playCard(key, value, players, playerIndex);
          return false;
        });
    });
  }

});
