import { Router } from "express";
import { interact } from "../controllers/lexController";

const router = Router();

router.route("/").post(interact);

export default router;
