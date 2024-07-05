import express from "express";
import GameController from "../controllers/gameController.js";
import { validateRequest } from "../helpers.js";
import { param, body } from "express-validator";

function AvatarRoutes(authenticator) {
  this.router = express.Router();
  this.authenticator = authenticator;
  this.gameController = new GameController();

  this.getRouter = () => this.router;

  this.initRoutes = function () {
    this.router.get("/", this.authenticator.isLoggedIn, (req, res, next) => {
      this.gameController
        .getAllAvatars()
        .then((avatars) => {
          res.status(200).send(avatars);
        })
        .catch((err) => {
          next(err);
        });
    });

    this.router.put(
      "/:avatarId",
      this.authenticator.isLoggedIn,
      param("avatarId").isInt({ gt: 0 }),
      validateRequest,
      (req, res, next) => {
        this.gameController
          .updateUserAvatar(req.user, req.params.avatarId)
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

export default AvatarRoutes;
