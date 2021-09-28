import { gunzip } from "zlib";
import { Buffer } from "buffer";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import {
  LexRuntimeV2Client,
  RecognizeUtteranceCommand,
} from "@aws-sdk/client-lex-runtime-v2";
import {
  BotInteractionInput,
  BotInteractionOutput,
} from "../models/botInteraction";
import { BotType } from "../models/enums/botType";
import { FormatType } from "../models/enums/formatType";
import { Readable } from "stream";

interface BotData {
  botId: string;
  botAliasId: string;
}

const region = "us-east-1";

const authBotData: BotData = {
  botId: "UAJBDNEPJV",
  botAliasId: "TSTALIASID",
};

const medicalApointmentBotData: BotData = {
  botId: "HO8CSVXGIH",
  botAliasId: "TSTALIASID",
};

export const lexClient = new LexRuntimeV2Client({
  region: region,
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region }),
    // Replace IDENTITY_POOL_ID with an appropriate Amazon Cognito Identity Pool ID for, such as 'us-east-1:xxxxxx-xxx-4103-9936-b52exxxxfd6'.
    identityPoolId: "us-east-1:0beff08b-2cc4-4b5a-ba27-f5183eaa0106",
  }),
});

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

export async function botInteraction(
  botInteractionInput: BotInteractionInput
): Promise<BotInteractionOutput | null> {
  let botData: BotData | null = null;

  if (botInteractionInput.botType == BotType.AUTH) {
    botData = authBotData;
  } else if (botInteractionInput.botType == BotType.MEDICAL_APPOINTMENT) {
    botData = medicalApointmentBotData;
  }

  const requestContentType =
    botInteractionInput.requestType == FormatType.TEXT
      ? "text/plain; charset=utf-8"
      : "audio/mpeg";
  const responseContentType =
    botInteractionInput.responseType == FormatType.TEXT
      ? "text/plain; charset=utf-8"
      : "audio/mpeg";

  const command = new RecognizeUtteranceCommand({
    inputStream: botInteractionInput.input,
    requestContentType: requestContentType,
    responseContentType: responseContentType,
    botId: botData?.botId,
    botAliasId: botData?.botAliasId,
    localeId: "es_ES",
    sessionId: botInteractionInput.sessionId,
  });

  try {
    const response = await lexClient.send(command);
    if (botInteractionInput.responseType === FormatType.TEXT) {
      if (response.messages) {
        const buffer = await decodeTextUtil(response.messages);
        return {
          textOutput: JSON.parse(buffer.toString()),
        };
      }
    } else {
      if (response.audioStream && response.messages) {
        const buffer = await decodeTextUtil(response.messages);

        const audioOutputReadable = response.audioStream as Readable;
        const audioBuffer = audioOutputReadable.read();

        return {
          textOutput: JSON.parse(buffer.toString()),
          audioOutput: audioBuffer,
        };
      }
    }
  } catch (e: any) {
    return {
      error: e.toString(),
    };
  }
  return null;
}
