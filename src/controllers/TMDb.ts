import { Request, Response } from 'express';
import fetchJSON from '../util/fetchJSON';
import { TMDbFilmSearch, FilmFull } from '../types/types';
import { TMPDbAPI, TMDb_GENRES } from '../util/constants';

/** Gets most popular films from TMDb API */
export const discover = (req: Request, res: Response) => {
  fetchJSON({
    url: `${TMPDbAPI}/discover/movie?api_key=${process.env.TMDbAPI_KEY}`,
    method: 'get'
  })
    .then((data: TMDbFilmSearch) => {
      // Converting genre_ids to string genres
      const results: FilmFull[] = data.results.map((result) => {
        const genres = result.genre_ids.map((id) => TMDb_GENRES[id]);
        delete result.genre_ids;
        return { ...result, genres };
      });
      res.status(200).send(results);
    })
    .catch(() => res.status(400).json('Unable to work with API'));
};

/** Searches for films */
export const searchFilms = (req: Request, res: Response) => {
  const { title } = req.params;
  fetchJSON({
    url: `${TMPDbAPI}/search/movie?api_key=${process.env.TMDbAPI_KEY}&query=${title}`,
    method: 'get'
  })
    .then((data) => {
      const results: TMDbFilmSearch[] = data.results;
      res.status(200).send(results);
    })
    .catch(() => res.status(400).json('Unable to work with API'));
};
