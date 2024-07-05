/**
 * Represents a Game.
 *
 * @param {string} date The date of the game in YYYY-MM-DD format.
 * @param {Meme[]} memes An array of Meme objects associated with the game.
 * @param {number[]} scores An array of numbers representing the scores of the game.
 */
function Game(date, memes, scores) {
  this.date = date;
  this.memes = memes;
  this.scores = scores;
}

export default Game;
