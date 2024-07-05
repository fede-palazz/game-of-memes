const CAPTION_NOT_FOUND = "Caption not found";
const CAPTIONS_NOT_AVAILABLE = "Captions not available";

function CaptionNotFoundError() {
  const error = new Error();
  error.customMessage = CAPTION_NOT_FOUND;
  error.customCode = 404;
  return error;
}

function CaptionsNotAvailableError() {
  const error = new Error();
  error.customMessage = CAPTIONS_NOT_AVAILABLE;
  error.customCode = 404;
  return error;
}

export { CaptionNotFoundError, CaptionsNotAvailableError };
