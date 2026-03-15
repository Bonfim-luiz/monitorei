import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import usersRouter from "./users.js";
import pdfRouter from "./pdf.js";
import resultsRouter from "./results.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(usersRouter);
router.use(pdfRouter);
router.use(resultsRouter);

export default router;
