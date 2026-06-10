import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import chatRoutes from "./routes/chat.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/chat", chatRoutes);

app.get("/", (_req: Request, res: Response) => {
  res.send("Spur AI Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});