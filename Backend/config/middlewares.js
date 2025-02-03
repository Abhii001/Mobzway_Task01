import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";

const allowedOrigins = [
    'http://localhost:5173',
    'https://nodetask01mobzway.netlify.app',
    'https://mobzway-task01.onrender.com'
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
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    }));

    app.use(helmet());
};

export default setupMiddlewares;
