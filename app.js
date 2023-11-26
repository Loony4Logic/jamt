import express from "express";
import path, { dirname } from "path";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import { fileURLToPath } from "url";
import { logger } from "#util";
import indexRouter from "#routes/index";

const app = express();
const currDirName = dirname(fileURLToPath(import.meta.url));

// app.use(morgan(
//   ":remote-addr - :remote-user \":method :url HTTP/:http-version\" :status \":referrer\" \":user-agent\"",
//   { stream: logger.stream },
// ));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(currDirName, "public")));

app.use("/api", indexRouter);

const rootRouter = express.Router();
rootRouter.get('(/*)?', async (req, res, next) => {
  res.sendFile(path.join(currDirName, 'public', 'index.html'));
});
app.use(rootRouter);

export default app;
