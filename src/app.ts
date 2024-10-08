import express from "express";
import { globalErrorHandler } from "./middlewares/error-handler";

// import routes
import authRouter from "./routes/auth.route";
import cookieParser from "cookie-parser";

const app = express();

// middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("From Auth Service");
});

// routes
app.use("/api/auth", authRouter);

app.use(globalErrorHandler);

export default app;
