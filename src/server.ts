import app from './app';
import cors from 'cors';
import bodyParser from 'body-parser';

app.use(cors());
app.use(bodyParser.json());

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('App is running');
});

export default server;
