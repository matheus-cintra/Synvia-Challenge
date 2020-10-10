import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

const app = express();

app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '50mb', extended: true }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.disable('x-powered-by');

require('./database/mongoose');
require('./middleware/middleware')(app);
require('./modules/index')(app);
// require('./tools/index')(app);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Synvia Pokédex - The ultimate health pokédex',
  });
});

// eslint-disable-next-line
app.use((req, res, next) => {
  res.status(404);
  res.json({ message: `Route not found ${req.url}` });
});

app.listen(process.env.PORT || 3000, () => {
  console.warn(`Listening on port: ${process.env.PORT}`); // eslint-disable-line
});

module.exports = app;
