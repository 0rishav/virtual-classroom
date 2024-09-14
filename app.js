import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors"

const app = express();
dotenv.config()
const PORT = process.env.PORT;

// body-parser
app.use(express.json({ limit: "50mb" }));
app.use(morgan("dev"));

// cookie-parser
app.use(cookieParser());

// cors
app.use(
  cors({
    origin: ['http://localhost:3000'],
    methods: ["POST", "PUT", "DELETE", "GET"],
    credentials: true,
  })
);

// routes
app.use("/api/v1", userRouter);

// TESTING API
app.get("/test", (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});

// Error Middleware
app.use(ErrorMiddleware);

// unknown route
app.all("*", (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} not found`);
  err.statusCode = 404;
  next(err);
});

// Run server
app.listen(PORT,(req,res)=>{
    console.log(`Server is running on PORT ${PORT}`)
    connectDB();
})