import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "./catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import jwt from "jsonwebtoken";
import { redis } from "../utils/redis";
import { updateAccessToken } from "../controllers/user";

// Middleware for checking if the user is authenticated
export const isAuthenticated = CatchAsyncError(async (req, res, next) => {
  const access_token = req.cookies.access_token;

  if (!access_token) {
    return next(new ErrorHandler("Please Login to access this resource", 400));
  }

  const decoded = jwt.decode(access_token);

  if (!decoded) {
    return next(new ErrorHandler("Access token is not valid", 400));
  }

  // Check if the access token is expired
  if (decoded.exp && decoded.exp <= Date.now() / 1000) {
    try {
      await updateAccessToken(req, res, next);
    } catch (error) {
      return next(error);
    }
  } else {
    const user = await redis.get(decoded.id);
    if (!user) {
      return next(new ErrorHandler("Please Login to access this resource", 400));
    }
    req.user = JSON.parse(user);
    next();
  }
});

// Middleware for checking if the user has an authorized role
export const authorizedRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role || "")) {
      return next(
        new ErrorHandler(
          `Role ${req.user?.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
