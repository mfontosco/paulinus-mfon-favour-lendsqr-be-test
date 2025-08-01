import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import  logger  from './utils/logger';
import userRoutes from "./routes/user.route";

dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));



app.use("/api/v1/users", userRoutes); 
app.use((err: any, req: any, res: any, next: any) => {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;
