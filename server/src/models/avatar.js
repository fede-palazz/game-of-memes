/**
 * Represents an avatar associated to one or many users.
 *
 * @param {number} id The id of the avatar.
 * @param {string} name The name of the file associated to the avatar with its extension.
 * @param {number} value The necessary number of points a user should have in order to use the avatar.
 */
function Avatar(id, name, value) {
  this.id = id;
  this.name = name;
  this.value = value;
}

export default Avatar;
