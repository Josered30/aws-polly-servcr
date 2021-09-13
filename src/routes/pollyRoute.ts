import { Router } from "express";
import { index } from "../controllers/pollyController";

const router = Router();

router.route("/").post(index);

export default router;
