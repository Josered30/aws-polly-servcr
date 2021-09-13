import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import {
  Engine,
  PollyClient,
  SynthesizeSpeechCommand,
} from "@aws-sdk/client-polly";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { Readable } from "stream";

const region = "us-east-1";

const pollyClient = new PollyClient({
  region: region,
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region }),
    // Replace IDENTITY_POOL_ID with an appropriate Amazon Cognito Identity Pool ID for, such as 'us-east-1:xxxxxx-xxx-4103-9936-b52exxxxfd6'.
    identityPoolId: "us-east-1:0beff08b-2cc4-4b5a-ba27-f5183eaa0106",
  }),
});

export async function getAudio(text: string): Promise<Readable | null> {
  const audio = await pollyClient.send(
    new SynthesizeSpeechCommand({
      Engine: Engine.NEURAL,
      OutputFormat: "mp3",
      Text: text,
      TextType: "text",
      VoiceId: "Joanna",
      SampleRate: "22050",
      LanguageCode: "en-US",
    })
  );
  if (audio.AudioStream instanceof Readable) {
    return audio.AudioStream;
  }
  return null;
}
