import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import logger from './utils/logger';
import userRoutes from "./routes/user.route";
import walletRoutes from './routes/wallet.route';
import { errorHandler } from './middlewares/errorHnadler';

dotenv.config();

const app = express();

app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));

console.log('✅ Welcome route is loaded');
app.get('/', (_req, res) => {
  res.status(200).json({
    message: 'Welcome to the Lendsqr Wallet API',
    status: 'success',
  });
});

app.use("/api/v1/users", userRoutes); 
app.use('/api/v1/wallets', walletRoutes);
app.use(/(.*)/, (_req, res) => {
  res.status(404).json({
    message: 'Route not found',
    status: 'error',
  });
});

app.use(errorHandler);

export default app;
