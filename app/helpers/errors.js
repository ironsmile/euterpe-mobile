export function errorToMessage(error, defaultMessage) {
  defaultMessage = defaultMessage || 'Unknown error.';

  if (error.code === 400 || error.status === 400) {
    return 'Authentication methods has changed. Try upgrading your app!';
  } else if (error.code === 401 || error.status === 401) {
    return 'Token has expired or has been revoked.';
  } else if (error.code === 404 || error.status === 404) {
    return 'No Euterpe server running on this address or there is a problem with its installation.';
  } else if (error.message) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  }

  return defaultMessage;
}
