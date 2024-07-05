import Authenticator from "./authenticator.js";
import AuthRoutes from "./routes/authRoutes.js";
import UserRoutes from "./routes/userRoutes.js";
import GameRoutes from "./routes/gameRoutes.js";
import AvatarRoutes from "./routes/avatarRoutes.js";

const PREFIX = "/api";

function initRoutes(app) {
  const authenticator = new Authenticator(app);
  const authRoutes = new AuthRoutes(authenticator);
  const userRoutes = new UserRoutes(authenticator);
  const gameRoutes = new GameRoutes(authenticator);
  const avatarRoutes = new AvatarRoutes(authenticator);

  app.use(`${PREFIX}/sessions`, authRoutes.getRouter());
  app.use(`${PREFIX}/users`, userRoutes.getRouter());
  app.use(`${PREFIX}/games`, gameRoutes.getRouter());
  app.use(`${PREFIX}/avatars`, avatarRoutes.getRouter());
}

export default initRoutes;
