import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";

const setupMiddlewares = (app) => {
    app.use(bodyParser.json());
    app.use(cors());
    app.use(helmet());
};

export default setupMiddlewares;
