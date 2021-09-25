import { Request, Response } from "express";
import { Readable } from "stream";
import {
  BotInteractionInput,
  BotInteractionOutput,
} from "../models/botInteraction";
import { FormatType } from "../models/enums/formatType";
import { botInteraction } from "../services/lexService";

export async function interact(req: Request, res: Response) {
  const botInteractionInput: BotInteractionInput = req.body;
  const data = await botInteraction(botInteractionInput);

  console.log(botInteractionInput);

  if (botInteractionInput.responseType == FormatType.TEXT) {
    res.json(data);
  } else {
    if (data?.output instanceof Readable) {
      res.set("Content-Disposition", "attachment; filename=audio");
      res.set("Content-Type", "audio/mpeg");
      data.output.pipe(res);
    } else {
      const result: BotInteractionOutput = {
        error: "AudioStream is not Readable",
      };
      res.json(result);
    }
  }
}
