export const messages = {
  success: {
    message: 'Operation successful',
    statusCode: 200
  },
  signedUp: {
    message: 'Successfully signed up',
    statusCode: 201
  },
  invalidId: {
    message: 'Invalid ID format',
    statusCode: 400
  },
  authIncorrect: {
    message: 'Your credentials are incorrect',
    statusCode: 401
  },
  noAccessToken: {
    message: 'No access token found',
    statuscode: 403
  },
  noRefreshToken: {
    message: 'No refresh token found',
    statusCode: 403
  },
  refreshNotVerified: {
    message: 'Refresh token is not verified',
    statusCode: 403
  },
  notFound: {
    message: 'Resource not found',
    statusCode: 404
  },
  userExists: {
    message: 'Username is taken',
    statusCode: 409
  },
  validationError: {
    message: 'Validation error',
    statusCode: 422,
  },
  serverError: {
    message: 'Internal server error',
    statusCode: 500
  },
};