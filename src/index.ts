import express from 'express';
import type { Request, Response } from 'express';
import morganMiddleware from './middlewares/morgonmiddleware.js';
import Logger from './logger.js';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger.js';
import helmet from 'helmet';
import cors from 'cors';
dotenv.config();

const app = express();
const port = process.env.PORT || 6000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//security

app.use(helmet());
app.use(cors());

// Logging middleware
app.use(morganMiddleware);

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.get('/', (req: Request, res: Response) => {
  Logger.info('Home route accessed', {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });
  res.send('Hello, Typescript');
});

const server = app.listen(port, () => {
  Logger.info(`Server started successfully on port ${port}`, {
    port,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  Logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    Logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  Logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    Logger.info('Process terminated');
    process.exit(0);
  });
});

export { app, server };
