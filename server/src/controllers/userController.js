import UserDao from "../daos/userDao.js";

function UserController() {
  this.userDao = new UserDao();

  /**
   * Creates a new user in the database.
   *
   * @param {string} username The username for the new user.
   * @param {string} password The password for the new user.
   * @returns A promise that resolves to true if the user has been created.
   */
  this.createUser = async (username, password) => {
    return this.userDao.createUser(username, password);
  };
}

export default UserController;
