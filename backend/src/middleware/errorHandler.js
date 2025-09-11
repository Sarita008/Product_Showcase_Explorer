
// backend/src/middleware/errorHandler.js
const errorHandler = (error, req, res, next) => {
  console.error('💥 Error:', error);

  // Default error response
  let statusCode = 500;
  let message = 'Internal Server Error';
  let details = null;

  // Axios errors
  if (error.response) {
    statusCode = error.response.status;
    message = error.response.data?.message || error.message;
    details = error.response.data;
  } else if (error.request) {
    statusCode = 503;
    message = 'Service Unavailable - External API not responding';
  } else if (error.code === 'ECONNABORTED') {
    statusCode = 408;
    message = 'Request Timeout';
  }

  // Validation errors
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    details = error.details;
  }

  // CORS errors
  if (error.message.includes('CORS')) {
    statusCode = 403;
    message = 'CORS Error - Origin not allowed';
  }

  // Rate limit errors
  if (error.message.includes('Too many requests')) {
    statusCode = 429;
    message = 'Too Many Requests';
  }

  const errorResponse = {
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method,
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = error.stack;
    errorResponse.details = details;
  }

  res.status(statusCode).json(errorResponse);
};

module.exports = { errorHandler };

