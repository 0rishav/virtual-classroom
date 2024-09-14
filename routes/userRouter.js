import express from "express"
import { activateUser, loginUser, logoutUser, registrationUser,  } from "../controllers/user";
import {  isAuthenticated } from "../middleware/auth";

const userRouter = express.Router();

userRouter.post("/register",registrationUser)

userRouter.post("/activate-user",activateUser)

userRouter.post("/login",loginUser)

userRouter.get("/logout",isAuthenticated,logoutUser)

export default userRouter;
