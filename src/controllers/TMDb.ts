import { Request, Response } from 'express';
import fetchJSON from '../util/fetchJSON';
import { IFilm } from '../types/types';
import { TMPDbAPI } from '../util/constants';

/** Gets most popular films from TMDb API */
export const discover = (req: Request, res: Response) => {
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
};
