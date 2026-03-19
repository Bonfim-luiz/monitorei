import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import usersRouter from "./users.js";
import pdfRouter from "./pdf.js";
import resultsRouter from "./results.js";
import concursosRouter from "./concursos.js";
import cidadesRouter from "./cidades.js";
import convocacoesRouter from "./convocacoes.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(usersRouter);
router.use(pdfRouter);
router.use(resultsRouter);
router.use(concursosRouter);
router.use(cidadesRouter);
router.use(convocacoesRouter);

export default router;
