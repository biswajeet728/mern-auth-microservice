import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("From Auth Service");
});

export default app;
