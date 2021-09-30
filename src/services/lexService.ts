import { gunzip } from "zlib";
import { Buffer } from "buffer";
import {
  BotInteractionInput,
  BotInteractionOutput,
  TextOutput,
} from "../models/botInteraction";
import { Readable } from "stream";

function decodeTextUtil(value: string): Promise<Buffer> {
  const data = Buffer.from(value, "base64");
  return new Promise((resolve, reject) => {
    gunzip(data, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer);
      }
    });
  });
}

function streamToString(stream: Readable): Promise<string> {
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk: string) => chunks.push(Buffer.from(chunk)));
    stream.on("error", (err) => reject(err));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("base64")));
  });
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

export async function parseData(
  data: BotInteractionInput
): Promise<BotInteractionOutput> {
  const textBuffer = await decodeTextUtil(data.value);
  return {
    textOutput: JSON.parse(textBuffer.toString()),
  };
}
