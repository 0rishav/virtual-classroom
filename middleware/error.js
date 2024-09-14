import ErrorHandler from "../utils/ErrorHandler";

const ErrorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server Error";

  // wrong mongoDB id
  if (err.name === "CastError") {
    const message = `Resource Not Found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }
  
  // duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }
  
  // jsonwebtoken error
  if (err.name === "JsonWebTokenError") {
    const message = `JSON web token is invalid, try again`;
    err = new ErrorHandler(message, 400);
  }
  
  // JWT expired error
  if (err.name === "TokenExpiredError") {
    const message = `JSON web token is expired, try again`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false, // Typically, success would be false for errors
    message: err.message,
  });
};

export default ErrorMiddleware;
