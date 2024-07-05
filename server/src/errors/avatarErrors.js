const AVATAR_NOT_FOUND = "Avatar not found";
const NOT_ENOUGH_POINTS = "You don't have enough points to use this avatar";

function AvatarNotFoundError() {
  const error = new Error();
  error.customMessage = AVATAR_NOT_FOUND;
  error.customCode = 404;
  return error;
}

function NotEnoughPointsError() {
  const error = new Error();
  error.customMessage = NOT_ENOUGH_POINTS;
  error.customCode = 403;
  return error;
}

export { AvatarNotFoundError, NotEnoughPointsError };
