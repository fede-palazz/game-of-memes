import express from "express";
import GameController from "../controllers/gameController.js";
import { validateRequest } from "../helpers.js";
import { param, body } from "express-validator";

function GameRoutes(authenticator) {
  this.router = express.Router();
  this.authenticator = authenticator;
  this.gameController = new GameController();

  this.getRouter = () => this.router;

  this.initRoutes = function () {
    this.router.get(
      "/new",
      this.authenticator.setRoundNumber,
      param("category").optional().isIn(["simpson", "griffin"]),
      validateRequest,
      (req, res, next) => {
        this.gameController
          .generateGame(req.query.category, req.rounds)
          .then((game) => {
            res.status(200).send(game);
          })
          .catch((err) => {
            next(err);
          });
      }
    );

    this.router.post(
      "/",
      this.authenticator.isLoggedIn,
      body("rounds").isArray(),
      validateRequest,
      (req, res, next) => {
        this.gameController
          .saveGame(req.user, req.body.rounds)
          .then((result) => {
            res.status(200).send(result);
          })
          .catch((err) => {
            next(err);
          });
      }
    );

    this.router.get("/", this.authenticator.isLoggedIn, (req, res, next) => {
      this.gameController
        .getAllGames(req.user)
        .then((games) => {
          res.status(200).send(games);
        })
        .catch((err) => {
          next(err);
        });
    });

    this.router.post(
      "/validate",
      body("memeId").isInt({ gt: 0 }),
      body("captionsIds").isArray(),
      body("answerId").isInt({ gte: 0 }),
      validateRequest,
      (req, res, next) => {
        this.gameController
          .validateAnswer(req.body.memeId, req.body.captionsIds, req.body.answerId)
          .then((result) => {
            res.status(200).send(result);
          })
          .catch((err) => {
            next(err);
          });
      }
    );
  };

  this.initRoutes();
}

export default GameRoutes;
