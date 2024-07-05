/**
 * Represents a user in the game.
 *
 * @param {number} id The id of the user.
 * @param {string} username The username of the user. This is unique for each user.
 * @param {number} points Number of points gained by the user inside the game.
 */
function User(id, username, points, avatar) {
  this.id = id;
  this.username = username;
  this.points = points;
  this.avatar = avatar;
}

export default User;
