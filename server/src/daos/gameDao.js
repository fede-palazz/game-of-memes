import db from "../db/db.js";
import Game from "../models/game.js";
import Meme from "../models/meme.js";
import Caption from "../models/caption.js";
import { InvalidCategoryError, MemeNotFoundError } from "../errors/memeErrors.js";
import { CaptionsNotAvailableError } from "../errors/captionErrors.js";
import { AvatarNotFoundError } from "../errors/avatarErrors.js";
import Avatar from "../models/avatar.js";

function GameDao() {
  this.db = db;

  /**
   * Saves a game to the database.
   *
   * @param {number} userId The ID of the user who played the game.
   * @param {string} date The date of the game in YYYY-MM-DD format.
   * @param {number[]} memeIds An array of IDs representing the memes used in the game.
   * @param {number[]} scores An array of numbers representing the scores for each meme in the game.
   * @returns A promise that resolves to true if the game has been successfully saved.
   */
  this.saveGame = (userId, date, memeIds, scores) => {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO games (userId, date, meme1, meme2, meme3, score1, score2, score3) 
      VALUES (?,?,?,?,?,?,?,?)`;
      this.db.run(sql, [userId, date, ...memeIds, ...scores], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
    });
  };

  /**
   * Retrieves all games played by a specific user.
   *
   * @param {number} userId The id of the user whose games are to be retrieved.
   * @returns A promise that resolves to an array of Game objects.
   */
  this.getAllGames = (userId) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT date, meme1, score1, meme2, score2, meme3, score3, memes.id as memeId, 
        memes.name as memeURL, memes.category FROM games, memes 
        WHERE userId=? AND (meme1=memes.id OR meme2=memes.id OR meme3=memes.id)`;
      this.db.all(sql, [userId], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        if (!rows || !rows.length) {
          resolve([]);
          return;
        }
        const games = [];

        for (let i = 0; i < rows.length; i += 3) {
          const gameRows = rows.slice(i, i + 3);
          const date = gameRows[0].date;
          const scores = [gameRows[0].score1, gameRows[0].score2, gameRows[0].score3];
          // Collect memes data in an array following the meme1, meme2, meme3 order
          const memeData = [
            gameRows.find((row) => row.memeId === gameRows[0].meme1),
            gameRows.find((row) => row.memeId === gameRows[0].meme2),
            gameRows.find((row) => row.memeId === gameRows[0].meme3),
          ];
          // Create an array of Meme objects
          const memes = memeData.map((row) => new Meme(row.memeId, row.memeURL, row.category));
          // Push the game
          games.push(new Game(date, memes, scores));
        }
        resolve(games);
      });
    });
  };

  /**
   * Fetches a specified limit of random captions associated with a given meme.
   *
   * @param {number} memeId The id of the meme to fetch the captions for.
   * @param {number} limit The number of captions to return.
   * @returns {Caption[]} A promise that resolves to an array of Caption objects.
   */
  this.getMemeRandomCaptions = (memeId, limit = 1) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT captions.id, captions.text FROM memes_captions, captions
            WHERE captions.id=memes_captions.captionId AND memes_captions.memeId=?
            ORDER BY RANDOM() LIMIT ?`;
      this.db.all(sql, [memeId, limit], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        if (!rows || !rows.length) {
          reject(new MemeNotFoundError());
          return;
        }
        resolve(rows.map((caption) => new Caption(caption.id, caption.text)));
      });
    });
  };

  /**
   * Fetches a specified limit of random captions, excluding the ones already associated with the given meme and those with specified IDs.
   *
   * @param {number} memeId The id of the meme to exclude.
   * @param {number[]} captionIds The ids of the captions to exclude.
   * @param {number} limit The number of captions to return.
   * @returns {Caption[]} An random array of Caption objects.
   */
  this.getRandomCaptionsExcluding = (memeId, captionIds, limit = 1) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT captions.id, captions.text FROM memes_captions, captions
                WHERE captions.id=memes_captions.captionId AND memes_captions.memeId<>? AND
                captions.id NOT IN (?, ?)
                ORDER BY RANDOM() LIMIT ?`;
      this.db.all(sql, [memeId, captionIds[0], captionIds[1], limit], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        if (!rows || !rows.length) {
          reject(new CaptionsNotAvailableError());
          return;
        }
        resolve(rows.map((caption) => new Caption(caption.id, caption.text)));
      });
    });
  };

  /**
   * Retrieves all captions for a specific meme.
   *
   * @param {number} memeId The id of the meme to fetch all captions for.
   * @returns {Caption[]} A promise that resolves to an array of Caption objects.
   */
  this.getAllCaptions = (memeId) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT captions.id, captions.text from captions, memes_captions
      WHERE captions.id=memes_captions.captionId AND memes_captions.memeId=?`;
      this.db.all(sql, [memeId], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        if (!rows || !rows.length) {
          reject(new MemeNotFoundError());
          return;
        }
        resolve(rows.map((caption) => new Caption(caption.id, caption.text)));
      });
    });
  };

  /**
   * Fetches a specified number of random memes from a given category.
   *
   * @param {string} category Category of meme to search for.
   * @param {number} limit Number of memes to fetch.
   * @returns A promise that resolves to an array of Meme.
   */
  this.getRandomMemes = (category, limit) => {
    return new Promise((resolve, reject) => {
      const sql = category
        ? `SELECT * FROM memes WHERE category=? ORDER BY RANDOM() LIMIT ?`
        : `SELECT * FROM memes ORDER BY RANDOM() LIMIT ?`;
      const params = category ? [category, limit] : [limit];
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        if (!rows || !rows.length) {
          if (category) {
            reject(new InvalidCategoryError());
            return;
          } else {
            reject(new MemeNotFoundError());
            return;
          }
        }
        resolve(rows.map((row) => new Meme(row.id, row.name, row.category)));
      });
    });
  };

  /**
   * Retrieves all available avatars.
   *
   * @returns A promise that resolves to an array of Avatar objects.
   */
  this.getAllAvatars = () => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM avatars`;
      this.db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        if (!rows || !rows.length) {
          resolve([]);
          return;
        }
        resolve(rows.map((row) => new Avatar(row.id, row.name, row.value)));
      });
    });
  };

  /**
   * Retrieves avatar information based on the avatar ID.
   *
   * @param {number} avatarId The id of the avatar to retrieve.
   * @returns A promise that resolves to an Avatar object representing the avatar information.
   */
  this.getAvatar = (avatarId) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM avatars WHERE id=?`;
      this.db.get(sql, [avatarId], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        if (!row) {
          reject(new AvatarNotFoundError());
          return;
        }
        resolve(new Avatar(row.id, row.name, row.value));
      });
    });
  };

  /**
   * Updates the avatar id for a specific user in the database.
   *
   * @param {number} userId The id of the user whose avatar ID is to be updated.
   * @param {number} avatarId The new avatar id to assign to the user.
   * @returns A promise that resolves to true if the avatar has been updated.
   */
  this.updateUserAvatar = (userId, avatarId) => {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * FROM avatars WHERE id=?`;
      this.db.get(sql, [avatarId], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        if (!row) {
          reject(new AvatarNotFoundError());
          return;
        }
        sql = `UPDATE users SET avatar=? WHERE id=?`;
        this.db.run(sql, [avatarId, userId], (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(true);
        });
      });
    });
  };
}

export default GameDao;
