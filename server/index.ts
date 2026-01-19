import express from "express";
import { registerRoutes } from "./routes.js";

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check (Render likes this)
app.get("/health", (_req, res) => res.status(200).send("ok"));

registerRoutes(app);

const port = Number(process.env.PORT || 5000);
app.listen(port, "0.0.0.0", () => {
  console.log(`API listening on port ${port}`);
});
