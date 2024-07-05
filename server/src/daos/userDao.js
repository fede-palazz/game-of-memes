import db from "../db/db.js";
import crypto from "crypto";
import { UserNotFoundError, UserAlreadyExistsError } from "../errors/userErrors.js";
import User from "../models/user.js";
import Avatar from "../models/avatar.js";

function UserDao() {
  this.db = db;

  /**
   * Checks whether the information provided during login (username and password) is correct.
   *
   * @param {string} username The username of the user.
   * @param {string} plainPassword The password of the user (in plain text).
   * @returns A Promise that resolves to true if the user is authenticated, false otherwise.
   */
  this.checkCredentials = async (username, plainPassword) => {
    return new Promise((resolve, reject) => {
      try {
        const sql = "SELECT username, password, salt FROM users WHERE username=?";
        this.db.get(sql, [username], (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          if (!row || row.username !== username || !row.salt) {
            resolve(false);
            return;
          }
          // Hash the plain password using the salt
          const hashedPassword = crypto.scryptSync(plainPassword, row.salt, 16);
          const passwordHex = Buffer.from(row.password, "hex");
          // Compare it with the hashed password stored in the database
          if (!crypto.timingSafeEqual(passwordHex, hashedPassword)) {
            resolve(false);
          }
          resolve(true);
        });
      } catch (err) {
        reject(err);
      }
    });
  };

  /**
   * Creates a new user and saves its information in the database.
   *
   * @param {string} username The username of the user. It must be unique.
   * @param {string} password The password of the user.
   * @returns A Promise that resolves to true if the user has been created.
   */
  this.createUser = async (username, password) => {
    return new Promise((resolve, reject) => {
      try {
        const salt = crypto.randomBytes(16);
        const hashedPassword = crypto.scryptSync(password, salt, 16);
        const sql =
          "INSERT INTO users (username, password, salt, points, avatar) VALUES (?,?,?,0,1)";
        this.db.run(sql, [username, hashedPassword, salt], function (err) {
          if (err) {
            if (err.message.includes("UNIQUE constraint failed: users.username")) {
              reject(new UserAlreadyExistsError());
              return;
            }
            reject(err);
            return;
          }
          resolve(true);
        });
      } catch (err) {
        reject(err);
      }
    });
  };

  /**
   * Fetch and retrieve the user corresponding to the username.
   *
   * @param {string} username The username of the user to retrieve.
   * @returns A promise that resolves to a User object if the username is valid.
   */
  this.getUserByUsername = async (username) => {
    return new Promise((resolve, reject) => {
      try {
        const sql = `SELECT users.id, username, points, avatars.id as avatarId, 
          avatars.name as avatarName, avatars.value as avatarValue
          FROM users, avatars WHERE avatars.id=users.avatar AND username=?`;
        this.db.get(sql, [username], (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          if (!row) {
            reject(new UserNotFoundError());
            return;
          }
          const avatar = new Avatar(row.avatarId, row.avatarName, row.avatarValue);
          const user = new User(row.id, row.username, row.points, avatar);
          resolve(user);
        });
      } catch (err) {
        reject(err);
      }
    });
  };
}

export default UserDao;
