import { BotType } from "./enums/botType";
import { FormatType } from "./enums/formatType";

interface TextOutput {
  content: string;
  contentType: string;
}

export interface BotInteractionInput {
  input: any;
  responseType: FormatType;
  requestType: FormatType;
  botType: BotType;
  sessionId: string;
}

export interface BotInteractionOutput {
  textOutput?: TextOutput[];
  audioOutput?: Buffer;
  error?: string;
}
