import path from "path";
import express from "express";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import userRouter from "./router/user.js";
import cors from "cors";




const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const api = express();
api.use(express.json());
api.use(cors({
    //To allow requests from client
    origin: [
      "http://localhost:8000",
    ],
    credentials: true,
  }));
api.use(cookieParser());
api.use('/api',userRouter)
api.use(express.static(path.join(__dirname , "public")));
api.use(express.static("public"));

api.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


export default api;
