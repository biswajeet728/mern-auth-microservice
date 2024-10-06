import express from "express";
import { globalErrorHandler } from "./middlewares/error-handler";

const app = express();

app.get("/", (req, res) => {
  res.send("From Auth Service");
});

app.use(globalErrorHandler);

export default app;
