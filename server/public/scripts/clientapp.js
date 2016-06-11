$(document).ready(function () {
  var socket = io();
  var player = {};
  var newPlayer = {};
  var playerLeft = {};
  var playerRight = {};

  socket.on('connect', function () {
    console.log('player connected');
  });

  $('#player-input-button').on('click', function () {
    setUpPlayer(event);
    socket.emit('playerLoggedIn', { nickname: newPlayer.nickname });
  });

  socket.on('play', function (data) {
    clearOutCards();
    placeAtTable = setPlaceAtTable(data);
    var pixel = 0;
    player = data.players[playerIndex];
    $('#table').append('<img width=100 src=cardImages/' + startCard + '.png>');
    $('.player-left-name').text(data.players[placeAtTable.playerLeftIndex].nickname + ' has '
    + data.players[placeAtTable.playerLeftIndex].hand.length + ' cards.');
    $('.player-right-name').text(data.players[placeAtTable.playerRightIndex].nickname + ' has '
    + data.players[placeAtTable.playerRightIndex].hand.length + ' cards.');
    $.each(player.hand, function (key, value) {
      var index = key + 1;
      $('#hand').append('<button class="card' + key + '" style="margin-top:2px; margin-left: '
      + pixel + 'px; float: left; z-index: ' + index + '"><img class=card"' + key +
      ' width=100" src=cardImages/' + value + '.png /></button>');

      $('.card' + key).click(function () {
          playCard(key, value);
          console.log('click is working', key, value);
          return false;
        });
    });
  });

  // $('form').submit(function () {
  //   socket.emit('chat message', $('#m').val());
  //   $('#m').val('');
  //   return false;
  // });
  //
  // socket.on('chat message', function (msg) {
  //   $('#messages').append($('<li>').text(msg));
  // });

  // socket.on('setUp', function (startCard) {
  //   $('#table').append('<img width=100 src=cardImages/' + startCard + '.png>');
  // });

  //create new player in database
  function setUpPlayer(event) {
    event.preventDefault();

    $.each($('#player-input-form').serializeArray(), function (i, field) {
        newPlayer[field.name] = field.value;
      });

    $('#player-input-form').children().val('');
    $('#player-input-form').hide();
    $.post('/players', newPlayer);
    console.log('player from submit player form', newPlayer);
    return newPlayer;
  }

  function clearOutCards() {
    $('#hand').text('');
    $('#cards').find('option').remove().end();
  }

  function setPlaceAtTable(data) {
    var playerIndex = 0;
    var playerLeftIndex = 0;
    var playerRightIndex = 0;
    var startCard = data.startCard;
    playerIndex = data.playerIndex;
    playerLeftIndex = getPlayerLeftIndex(playerIndex);
    playerRightIndex = getPlayerRightIndex(playerIndex);
    var placeAtTable = {
      playerIndex: playerIndex,
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

  function playCard(index, playedCard) {
    socket.emit('playCard', { playedCard: playedCard, index: index });
  }

});
