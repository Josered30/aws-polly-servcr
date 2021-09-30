import { Request, Response, Router } from "express";
import { index } from "../controllers/lexController";

const router = Router();

router.route("/").post(index);

export default router;
