/**
 * Represents a meme in the game.
 *
 * @param {number} id The id of the meme.
 * @param {string} name The name of the file associated to the meme with its extension.
 * @param {string} category The category associated to the meme.
 * @param {Caption[]} captions An array of Caption objects.
 */
function Meme(id, name, category, captions) {
  this.id = id;
  this.name = name;
  this.category = category;
  this.captions = captions ? captions : [];
}

export default Meme;
