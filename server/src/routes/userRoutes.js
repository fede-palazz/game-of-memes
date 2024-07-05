import express from "express";
import UserController from "../controllers/userController.js";
import { validateRequest } from "../helpers.js";
import { param, body } from "express-validator";

function UserRoutes(authenticator) {
  this.router = express.Router();
  this.authenticator = authenticator;
  this.userController = new UserController();

  this.getRouter = () => this.router;

  this.initRoutes = () => {
    /**
     * Route for creating a user. It does not require authentication.
     * It requires the following body parameters:
     * - username {string} - It cannot be empty and it must be unique.
     * - password {string} - It cannot be empty.
     * @returns It returns a 200 status code.
     */
    this.router.post(
      "/",
      body("username").isString().notEmpty().withMessage("Field 'username' is required"),
      body("password").isString().notEmpty().withMessage("Field 'password' is required"),
      validateRequest,
      (req, res, next) => {
        this.userController
          .createUser(req.body.username, req.body.password)
          .then(() => res.status(200).end())
          .catch((err) => {
            next(err);
          });
      }
    );
  };

  this.initRoutes();
}

export default UserRoutes;
