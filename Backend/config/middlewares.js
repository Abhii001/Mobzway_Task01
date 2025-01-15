import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";

const setupMiddlewares = (app) => {
    app.use(bodyParser.json());
    cors({
        origin: process.env.ALLOWED_ORIGIN || "http://localhost:5173",
    });
    app.use(helmet());
};

export default setupMiddlewares;
