import 'package:flutter/material.dart';
import '../services/socket_service.dart';

class GameProvider extends ChangeNotifier {
  final SocketService _socketService = SocketService();
  String? _currentGameId;
  Map<String, dynamic>? _gameState;
  List<Map<String, dynamic>> _gameHistory = [];
  bool _isConnected = false;

  String? get currentGameId => _currentGameId;
  Map<String, dynamic>? get gameState => _gameState;
  List<Map<String, dynamic>> get gameHistory => _gameHistory;
  bool get isConnected => _isConnected;

  void initialize() {
    _socketService.connect();
    _setupListeners();
    _isConnected = true;
    notifyListeners();
  }

  void _setupListeners() {
    _socketService.onGameCreated((data) {
      _currentGameId = data['gameId'];
      _gameState = data['game'];
      notifyListeners();
    });

    _socketService.onPlayerJoined((data) {
      _gameState = data['game'];
      notifyListeners();
    });

    _socketService.onDiceRolled((data) {
      notifyListeners();
    });

    _socketService.onPieceMoved((data) {
      notifyListeners();
    });

    _socketService.onGameCompleted((data) {
      _gameHistory.add(data);
      _currentGameId = null;
      _gameState = null;
      notifyListeners();
    });
  }

  void createGame(String gameMode) {
    _socketService.createGame(gameMode);
  }

  void joinGame(String gameId) {
    _socketService.joinGame(gameId);
  }

  void rollDice(String playerId, String username) {
    _socketService.rollDice(_currentGameId!, playerId, username);
  }

  void movePiece(String playerId, int pieceId, int newPosition, int diceValue) {
    _socketService.movePiece(_currentGameId!, playerId, pieceId, newPosition, diceValue);
  }

  void finishGame(String winnerId, String winnerName) {
    _socketService.finishGame(_currentGameId!, winnerId, winnerName);
  }

  @override
  void dispose() {
    _socketService.disconnect();
    super.dispose();
  }
}