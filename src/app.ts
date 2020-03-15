import express from 'express';

// Importing modules
import { discover } from './controllers/TMDb';
import { register } from './controllers/User';

// .env for development purposes
require('dotenv').config();

const app = express();

// TMDb related API routes
app.get('/discover', discover);

// New User registration route
app.get('/register', register);

export default app;
