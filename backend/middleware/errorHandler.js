// Global error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    user: req.user?.id,
    timestamp: new Date().toISOString()
  });

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.details || err.message,
      code: 'VALIDATION_ERROR'
    });
  }

  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        details: 'Maximum file size is 50MB',
        code: 'FILE_TOO_LARGE'
      });
    }
    
    return res.status(400).json({
      error: 'File upload error',
      details: err.message,
      code: 'FILE_UPLOAD_ERROR'
    });
  }

  if (err.code === '23505') { // PostgreSQL unique constraint violation
    return res.status(409).json({
      error: 'Resource already exists',
      details: 'A resource with this information already exists',
      code: 'DUPLICATE_RESOURCE'
    });
  }

  if (err.code === '23503') { // PostgreSQL foreign key constraint violation
    return res.status(400).json({
      error: 'Invalid reference',
      details: 'Referenced resource does not exist',
      code: 'INVALID_REFERENCE'
    });
  }

  if (err.code === '42P01') { // PostgreSQL undefined table
    return res.status(500).json({
      error: 'Database configuration error',
      details: 'Required database table is missing',
      code: 'DB_CONFIG_ERROR'
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token',
      details: 'The provided authentication token is invalid',
      code: 'INVALID_TOKEN'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expired',
      details: 'The authentication token has expired',
      code: 'TOKEN_EXPIRED'
    });
  }

  // Handle rate limiting errors
  if (err.status === 429) {
    return res.status(429).json({
      error: 'Too many requests',
      details: 'Rate limit exceeded. Please try again later.',
      code: 'RATE_LIMIT_EXCEEDED'
    });
  }

  // Handle Redis connection errors
  if (err.code === 'ECONNREFUSED' && err.syscall === 'connect') {
    return res.status(503).json({
      error: 'Service temporarily unavailable',
      details: 'Cache service is not available',
      code: 'CACHE_UNAVAILABLE'
    });
  }

  // Handle database connection errors
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    return res.status(503).json({
      error: 'Service temporarily unavailable',
      details: 'Database service is not available',
      code: 'DB_UNAVAILABLE'
    });
  }

  // Default error response
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';
  const code = err.code || 'INTERNAL_ERROR';

  // Don't expose internal errors in production
  const details = process.env.NODE_ENV === 'production' 
    ? 'An unexpected error occurred' 
    : err.stack;

  res.status(statusCode).json({
    error: message,
    details,
    code,
    timestamp: new Date().toISOString(),
    path: req.url,
    method: req.method
  });
};

// Async error wrapper for route handlers
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Custom error class for application errors
export class AppError extends Error {
  constructor(message, statusCode, code = 'APP_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error types
export const ErrorTypes = {
  VALIDATION: (message) => new AppError(message, 400, 'VALIDATION_ERROR'),
  UNAUTHORIZED: (message = 'Unauthorized access') => new AppError(message, 401, 'UNAUTHORIZED'),
  FORBIDDEN: (message = 'Access forbidden') => new AppError(message, 403, 'FORBIDDEN'),
  NOT_FOUND: (message = 'Resource not found') => new AppError(message, 404, 'NOT_FOUND'),
  CONFLICT: (message = 'Resource conflict') => new AppError(message, 409, 'CONFLICT'),
  RATE_LIMIT: (message = 'Rate limit exceeded') => new AppError(message, 429, 'RATE_LIMIT'),
  INTERNAL: (message = 'Internal server error') => new AppError(message, 500, 'INTERNAL_ERROR'),
  SERVICE_UNAVAILABLE: (message = 'Service unavailable') => new AppError(message, 503, 'SERVICE_UNAVAILABLE')
};
