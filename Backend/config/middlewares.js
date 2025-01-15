import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";

const allowedOrigins = ['https://nodetask01mobzway.netlify.app'];

const setupMiddlewares = (app) => {
    app.use(bodyParser.json());
    app.use(cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST'],
    }));

    app.use(helmet());
};

export default setupMiddlewares;
