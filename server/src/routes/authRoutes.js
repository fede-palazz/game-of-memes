import express from "express";
import { body } from "express-validator";
import { validateRequest } from "../helpers.js";

function AuthRoutes(authenticator) {
  this.router = express.Router();
  this.authenticator = authenticator;

  this.getRouter = () => this.router;

  this.initRoutes = () => {
    /**
     * Route for logging in a user.
     * It does not require authentication.
     * It expects the following body parameters:
     * - username {string} - It cannot be empty.
     * - password {string} - It cannot be empty.
     * @throws It returns an error if the username represents a non-existing user or if the password is incorrect.
     * @returns It returns the logged in user.
     */
    this.router.post(
      "/",
      body("username").notEmpty().isString().withMessage("Field 'username' is required"),
      body("password").notEmpty().isString().withMessage("Field 'password' is required"),
      validateRequest,
      (req, res, next) => {
        this.authenticator
          .login(req, res, next)
          .then((user) => res.status(200).json(user))
          .catch((err) => {
            res.status(401).json(err);
          });
      }
    );

    /**
     * Route for retrieving the currently logged in user.
     * It expects the user to be logged in.
     * It returns the logged in user.
     */
    this.router.get("/current", this.authenticator.isLoggedIn, (req, res) =>
      res.status(200).json(req.user)
    );

    /**
     * Route for logging out the currently logged in user.
     * It expects the user to be logged in.
     * It returns a 200 status code.
     */
    this.router.delete("/current", this.authenticator.isLoggedIn, (req, res, next) =>
      this.authenticator
        .logout(req, res, next)
        .then(() => res.status(200).end())
        .catch((err) => next(err))
    );
  };

  this.initRoutes();
}

export default AuthRoutes;
