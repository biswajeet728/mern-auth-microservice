import express from "express";
import cors from "cors";
import { globalErrorHandler } from "./middlewares/error-handler";

// import routes
import authRouter from "./routes/auth.route";
import cookieParser from "cookie-parser";

const app = express();

// middlewares
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  })
);
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
