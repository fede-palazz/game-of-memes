import passport from "passport";
import session from "express-session";
import LocalStrategy from "passport-local";
import UserDao from "./daos/userDao.js";

function Authenticator(app) {
  this.app = app;
  this.userDao = new UserDao();
  this.secret = "memegame1234";

  this.initAuth = () => {
    this.app.use(
      session({
        secret: this.secret,
        resave: false,
        saveUninitialized: false,
      })
    );
    this.app.use(passport.initialize());
    this.app.use(passport.session());

    // Setup passport local strategy
    passport.use(
      new LocalStrategy((username, password, done) => {
        this.userDao.checkCredentials(username, password).then((authenticated) => {
          if (!authenticated) {
            return done(null, false, { message: "Incorrect credentials" });
          }
          this.userDao.getUserByUsername(username).then((user) => {
            return done(null, user);
          });
        });
      })
    );

    /**
     * Serializes the user to the session.
     * This method is called when a user is authenticated and the user is serialized to the session.
     */
    passport.serializeUser((user, done) => {
      done(null, user);
    });

    /**
     * Deserializes the user from the session.
     * This method is called when a user is deserialized from the session.
     * It retrieves the user from the database and returns it.
     */
    passport.deserializeUser((user, done) => {
      this.userDao
        .getUserByUsername(user.username)
        .then((user) => {
          done(null, user);
        })
        .catch((err) => {
          done(null, err);
        });
    });
  };

  /**
   * Logs in a user.
   *
   * @param req The request object.
   * @param res The response object.
   * @param next The next middleware.
   * @returns A Promise that resolves to the logged in user or rejects with an error message.
   */
  this.login = async (req, res, next) => {
    return new Promise((resolve, reject) => {
      passport.authenticate("local", (err, user, info) => {
        if (err) return reject(err);
        if (!user) return reject(info);
        req.login(user, (err) => {
          if (err) return reject(err);
          return resolve(req.user);
        });
      })(req, res, next);
    });
  };

  /**
   * Logs out the user.
   *
   * @param req The request object.
   * @param res The response object.
   * @param next The next middleware function.
   * @returns A Promise that resolves to null.
   */
  this.logout = async (req, res, next) => {
    return new Promise((resolve, _) => {
      req.logout(() => resolve(null));
    });
  };

  /**
   * Middleware function to check if the user is logged in.
   * If the user is authenticated, it calls the next middleware function.
   * Otherwise, it returns a 401 error response.
   *
   * @param req The request object.
   * @param res The response object.
   * @param next The next middleware function.
   */
  this.isLoggedIn = async (req, res, next) => {
    if (req.isAuthenticated()) return next();
    return res.status(401).json({ error: "Unauthenticated user", status: 401 });
  };

  this.setRoundNumber = async (req, res, next) => {
    req.rounds = req.isAuthenticated() ? 3 : 1;
    return next();
  };

  this.initAuth();
}

export default Authenticator;
