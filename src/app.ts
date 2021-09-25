import express from "express";
import morgan from "morgan";
import cors from "cors";
import pollyRoutes from "./routes/pollyRoute";
import lexRoutes from "./routes/lexRoute";

const app = express();

app.set("port", process.env.PORT || 3000);

app.use(morgan("dev"));
const corsOptions = {
  exposedHeaders: ["Content-Range", "X-Content-Range"],
};
app.use(cors(corsOptions));

app.use(express.json());

app.use("/api/polly", pollyRoutes);
app.use("/api/lex", lexRoutes);

export default app;
