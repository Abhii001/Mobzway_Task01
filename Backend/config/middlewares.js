import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";

const allowedOrigins = [
    'https://nodetask01mobzway.netlify.app',
    'http://localhost:5174/'
];

const setupMiddlewares = (app) => {
    app.use(bodyParser.json());

    app.use(cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('CORS policy: Access denied from this origin'));
            }
        },
        methods: ['GET', 'POST'],
        credentials: true,
    }));

    app.use(helmet());
};

export default setupMiddlewares;
