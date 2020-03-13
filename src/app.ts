import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetchJSON from './util/fetchJSON';
import { IFilm } from './types/types';
import { TMPDbAPI } from './util/constants';
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/homepage-discover', (req, res) => {
  fetchJSON({
    url: TMPDbAPI + '/discover/movie?api_key=' + process.env.TMDbAPI_KEY,
    method: 'get'
  }).then((data) => {
    const tmp: IFilm[] = data.results.reduce((acc: any, film: any) => {
      acc.push({
        title: film.title,
        averageRating: film.vote_average,
        posthPath: film.poster_path
      });
      return acc;
    }, []);
    res.status(200).send(tmp);
  });
});

export default app;
