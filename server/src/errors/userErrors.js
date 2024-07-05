const USER_NOT_FOUND = "The user does not exist";
const USER_ALREADY_EXISTS = "The username already exists";
const UNAUTHORIZED_USER = "You cannot access this resource";

function UserNotFoundError() {
  const error = new Error();
  error.customMessage = USER_NOT_FOUND;
  error.customCode = 404;
  return error;
}

function UserAlreadyExistsError() {
  const error = new Error();
  error.customMessage = USER_ALREADY_EXISTS;
  error.customCode = 409;
  return error;
}

function UnauthorizedUserError() {
  const error = new Error();
  error.customMessage = UNAUTHORIZED_USER;
  error.customCode = 401;
  return error;
}

export { UserNotFoundError, UserAlreadyExistsError, UnauthorizedUserError };
