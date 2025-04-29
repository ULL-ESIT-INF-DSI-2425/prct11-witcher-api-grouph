import express from 'express';

export const defaultRouter: express.Router = express.Router();

defaultRouter.all('*', (_, res) => {
  res.status(501).send();
});