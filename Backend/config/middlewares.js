import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";

const setupMiddlewares = (app) => {
    app.use(bodyParser.json());
    app.use(cors({
        origin: ['http://localhost:5173', 'https://mobzway-task01.onrender.com'],
        methods: 'GET,POST,PUT,DELETE',
        credentials: true,
      }));
      
    app.use(helmet());
};

export default setupMiddlewares;
