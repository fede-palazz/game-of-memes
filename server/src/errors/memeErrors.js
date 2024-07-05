const MEME_NOT_FOUND = "Meme not found";
const INVALID_CATEGORY = "Invalid category";

function MemeNotFoundError() {
  const error = new Error();
  error.customMessage = MEME_NOT_FOUND;
  error.customCode = 404;
  return error;
}

function InvalidCategoryError() {
  const error = new Error();
  error.customMessage = INVALID_CATEGORY;
  error.customCode = 404;
  return error;
}

export { MemeNotFoundError, InvalidCategoryError };
