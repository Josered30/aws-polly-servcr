import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { getAudio } from "../services/pollyService";

export async function index(req: Request, res: Response) {
  res.set("Content-Disposition", "attachment; filename=audio");
  res.set("Content-Type", "audio/mpeg");
  const { text } = req.body;
  const content = await getAudio(text);

  if (content) {
    content?.pipe(res);
  } else {
    res.status(500).json("error");
  }
}
