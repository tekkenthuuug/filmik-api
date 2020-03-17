import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import knex from 'knex';
import nodemailer from 'nodemailer';

// Importing modules
import { discover } from './controllers/TMDb';
import { handleRegister } from './controllers/userRegister';
import { handleSendCode } from './controllers/sendCode';
import { handleConfirm } from './controllers/userConfirmation';

// .env for development purposes
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  }
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

// New User registration route
app.post('/register', handleRegister(db));
// Sends varification code if user is not varified yet
app.get('/sendCode/:id', handleSendCode(db, transporter));
// Route that recieves and checks confirmation code
app.put('/confirm', handleConfirm(db));

export default app;
