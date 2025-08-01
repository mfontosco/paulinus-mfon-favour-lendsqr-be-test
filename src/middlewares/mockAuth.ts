// src/middlewares/mockAuth.ts

import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const mockAuth = (req: any, res: Response, next: NextFunction) => {
  req.user = {
    id: 'f57f69bd-4672-4e3d-ad2a-e7037fd91302',
    email: 'john234y3@example.com',
  };
  next();
};

export default mockAuth;
