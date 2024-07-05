import { shuffleCaptions } from "../helpers.js";
import MemeResponse from "../responses/memeResponse.js";
import ValidateAnswerResponse from "../responses/validateAnswerResponse.js";
import GameDao from "../daos/gameDao.js";
import UserDao from "../daos/userDao.js";
import { NotEnoughPointsError } from "../errors/avatarErrors.js";

function GameController() {
  this.gameDao = new GameDao();
  this.userDao = new UserDao();

  /**
   * Generates a new game with specified rounds and from a specific category.
   *
   * @param {string} category The category of memes to generate the game from.
   * @param {number} rounds The number of rounds to generate.
   * @returns A promise that resolves to an array of Game objects representing the generated games.
   */
  this.generateGame = async (category, rounds) => {
    const memes = await this.gameDao.getRandomMemes(category, rounds);
    for (const meme of memes) {
      const captions = await this.generateCaptions(meme.id);
      meme.captions = captions;
    }
    const response = memes.map((meme) => new MemeResponse(meme));
    return response;
  };

  /**
   * Generates captions for a meme identified by its id.
   *
   * @param {number} memeId The id of the meme for which captions are to be generated.
   * @returns A promise that resolves to an array of Caption objects generated for the meme.
   */
  this.generateCaptions = async (memeId) => {
    const validCaptions = await this.gameDao.getMemeRandomCaptions(memeId, 2);
    const randomCaptions = await this.gameDao.getRandomCaptionsExcluding(
      memeId,
      [...validCaptions.map((caption) => caption.id)],
      5
    );
    const captions = [...validCaptions, ...randomCaptions];
    shuffleCaptions(captions);
    return captions;
  };

  /**
   * Validates the user's answer for a meme based on the selected caption.
   *
   * @param {number} memeId The id of the meme for which the answer is being validated.
   * @param {number[]} captionsIds An array of ids representing the available captions for the meme.
   * @param {number} answerId The id of the caption selected by the user as their answer.
   * @returns Returns a promise that resolves to a ValidateAnswerResponse object.
   */
  this.validateAnswer = async (memeId, captionsIds, answerId) => {
    const captions = await this.gameDao.getAllCaptions(memeId);
    const validCaptions = captions.filter((caption) => captionsIds.includes(caption.id));
    const isValid = validCaptions.map((caption) => caption.id).includes(answerId);
    const points = isValid ? 5 : 0;
    return new ValidateAnswerResponse(validCaptions, isValid, points);
  };

  /**
   * Saves a game session for a user.
   *
   * @param {User} user The user object representing the player.
   * @param {any[]} rounds An array of Round objects representing each round in the game session.
   * @returns A promise that resolves to true if the game has been successfully saved.
   */
  this.saveGame = async (user, rounds) => {
    const date = new Date().toISOString().split("T")[0];
    return this.gameDao.saveGame(
      user.id,
      date,
      rounds.map((round) => round.memeId),
      rounds.map((round) => round.score)
    );
  };

  /**
   * Retrieves all game sessions played by a specific user.
   *
   * @param {User} user The user object whose game sessions are to be retrieved.
   * @returns A promise that resolves to an array of Game objects representing the user's game sessions.
   */
  this.getAllGames = async (user) => {
    return this.gameDao.getAllGames(user.id);
  };

  /**
   * Retrieves all available avatars.
   *
   * @returns A promise that resolves to an array of Avatar objects.
   */
  this.getAllAvatars = async () => {
    return this.gameDao.getAllAvatars();
  };

  /**
   * Updates the avatar id for a specific user in the database.
   *
   * @param {User} user The id of the user whose avatar ID is to be updated.
   * @param {number} avatarId The new avatar id to assign to the user.
   * @returns A promise that resolves to true if the avatar has been updated.
   */
  this.updateUserAvatar = async (user, avatarId) => {
    const avatar = await this.gameDao.getAvatar(avatarId);
    // Check if user has enough points to use the avatar
    if (avatar.value > user.points) {
      return Promise.reject(new NotEnoughPointsError());
    }
    return this.gameDao.updateUserAvatar(user.id, avatarId);
  };
}

export default GameController;
