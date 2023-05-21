/* eslint-disable no-underscore-dangle */
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

export default function setupExpress() {
  const app = express();
  app.set('view engine', 'ejs');
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  app.use('/public', express.static(`${__dirname}/../../public`));

  return app;
}
