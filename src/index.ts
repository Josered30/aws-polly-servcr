import dotenv from "dotenv";
import app from "./app";
dotenv.config();

async function main() {
  await app.listen(app.get("port"));
  console.log("Listening from port: ", app.get("port"));
}

main();
