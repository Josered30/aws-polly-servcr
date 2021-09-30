export interface TextOutput {
  content: string;
  contentType: string;
}

export interface BotInteractionOutput {
  textOutput?: TextOutput[];
  error?: string;
}

export interface BotInteractionInput {
  value: any;
}
