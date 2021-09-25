import { BotType } from "./enums/botType";
import { FormatType } from "./enums/formatType";

export interface BotInteractionInput {
  input: any;
  responseType: FormatType;
  requestType: FormatType;
  botType: BotType;
  sessionId: string;
}

export interface BotInteractionOutput {
  output?: any;
  error?: string;
}
