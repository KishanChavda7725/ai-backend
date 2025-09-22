import express from "express";
import searchRouter from "./search.routes";
import chatRouter from "./chat.routes";
import authRouter from "./auth.routes";
import { withoutAuth, withAuth } from "../middleware/comman";

const apiRouter = express.Router();

apiRouter.use("/auth", withoutAuth(), authRouter);
apiRouter.use("/search", searchRouter);
apiRouter.use("/chat", withAuth(), chatRouter);

export default apiRouter;
