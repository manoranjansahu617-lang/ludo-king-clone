class UserModel {
  final String id;
  final String username;
  final String email;
  final String? displayName;
  final int wins;
  final int losses;
  final int totalGames;
  final int rating;
  final bool isAdmin;

  UserModel({
    required this.id,
    required this.username,
    required this.email,
    this.displayName,
    required this.wins,
    required this.losses,
    required this.totalGames,
    required this.rating,
    required this.isAdmin,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? '',
      username: json['username'] ?? '',
      email: json['email'] ?? '',
      displayName: json['displayName'],
      wins: json['wins'] ?? 0,
      losses: json['losses'] ?? 0,
      totalGames: json['totalGames'] ?? 0,
      rating: json['rating'] ?? 1000,
      isAdmin: json['isAdmin'] ?? false,
    );
  }
}