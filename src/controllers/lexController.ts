import { Request, Response } from "express";
import { BotInteractionInput } from "../models/botInteraction";
import { parseData } from "../services/lexService";

export async function index(req: Request, res: Response) {
  const botInteractionInput: BotInteractionInput = req.body;
  console.log(botInteractionInput);
  const data = await parseData(botInteractionInput);
  res.json(data);
}
