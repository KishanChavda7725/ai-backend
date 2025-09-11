import { log } from "./utils/logger";
import { connectDB } from "./config/database";
import express from "express";
import cors from "cors";
import { corsOptions } from "./config/corsOptions";
import searchRoutes from "./routes/search.routes";
import { checkAccessKey } from "./middleware/accessKey";
import fs from "fs";
import path from "path";
const PORT = process.env.PORT || 5174;

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

// Ensure upload path exists
const uploadPath = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

app.use("/api", checkAccessKey, searchRoutes);

app.get("/", (_, res) => {
  res.send("API is running...");
});

connectDB();
app.listen(PORT, () => {
  log(`Server running at http://localhost:${PORT}`);
});
