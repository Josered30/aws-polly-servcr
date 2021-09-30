import express from "express";
import morgan from "morgan";
import cors from "cors";
import lexRoutes from "./routes/lexRoute";

const app = express();

app.set("port", process.env.PORT || 3000);

app.use(morgan("dev"));
const corsOptions = {
  exposedHeaders: ["Content-Range", "X-Content-Range"],
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/lex", lexRoutes);

export default app;
