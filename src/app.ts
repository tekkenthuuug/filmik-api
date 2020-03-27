import express from 'express';
import knex from 'knex';
import nodemailer from 'nodemailer';
import morgan from 'morgan';
import redisClient from './redis';

// Middleware
import cors, { CorsOptions } from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import requireAuth from './middleware/requireAuth';

// Importing modules
import { discover, searchFilms } from './controllers/TMDb';
import { handleRegister } from './controllers/userRegister';
import { handleConfirm } from './controllers/userConfirmation';
import { handleLogin } from './controllers/userLogin';

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));

const db = knex({
  client: 'pg',
  connection: process.env.POSTGRES_URI
});

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// TMDb related API routes
app.get('/discover', discover);
app.get('/discover/:title', searchFilms);

// New User registration route
app.post('/register', handleRegister(db, transporter, redisClient));

// Route that recieves and checks confirmation code
app.put('/register/confirm', handleConfirm(db, redisClient));

// User login route
app.post('/login', handleLogin(db, transporter, redisClient));

export default app;
