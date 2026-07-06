import 'package:socket_io_client/socket_io_client.dart' as IO;

class SocketService {
  static const String socketUrl = 'http://localhost:5000';
  late IO.Socket _socket;

  void connect() {
    _socket = IO.io(
      socketUrl,
      IO.OptionBuilder()
          .setTransports(['websocket'])
          .disableAutoConnect()
          .build(),
    );

    _socket.connect();

    _socket.onConnect((_) {
      print('Connected to socket server');
    });

    _socket.onDisconnect((_) {
      print('Disconnected from socket server');
    });
  }

  void disconnect() {
    _socket.disconnect();
  }

  void createGame(String gameMode) {
    _socket.emit('createGame', {'gameMode': gameMode});
  }

  void joinGame(String gameId) {
    _socket.emit('joinGame', {'gameId': gameId});
  }

  void rollDice(String gameId, String playerId, String username) {
    _socket.emit('rollDice', {
      'gameId': gameId,
      'playerId': playerId,
      'username': username,
    });
  }

  void movePiece(String gameId, String playerId, int pieceId, int newPosition, int diceValue) {
    _socket.emit('movePiece', {
      'gameId': gameId,
      'playerId': playerId,
      'pieceId': pieceId,
      'newPosition': newPosition,
      'diceValue': diceValue,
    });
  }

  void finishGame(String gameId, String winnerId, String winnerName) {
    _socket.emit('gameFinished', {
      'gameId': gameId,
      'winnerId': winnerId,
      'winnerName': winnerName,
    });
  }

  void onGameCreated(Function(Map<String, dynamic>) callback) {
    _socket.on('gameCreated', (data) => callback(data));
  }

  void onPlayerJoined(Function(Map<String, dynamic>) callback) {
    _socket.on('playerJoined', (data) => callback(data));
  }

  void onDiceRolled(Function(Map<String, dynamic>) callback) {
    _socket.on('diceRolled', (data) => callback(data));
  }

  void onPieceMoved(Function(Map<String, dynamic>) callback) {
    _socket.on('pieceMoved', (data) => callback(data));
  }

  void onGameCompleted(Function(Map<String, dynamic>) callback) {
    _socket.on('gameCompleted', (data) => callback(data));
  }
}