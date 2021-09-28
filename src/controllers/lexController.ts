import { Request, Response } from "express";
import { BotInteractionInput } from "../models/botInteraction";
import { botInteraction } from "../services/lexService";

export async function interact(req: Request, res: Response) {
  const botInteractionInput: BotInteractionInput = req.body;
  console.log(botInteractionInput);
  const data = await botInteraction(botInteractionInput);
  res.json(data);
}
