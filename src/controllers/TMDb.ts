import { Request, Response } from 'express';
import fetchJSON from '../util/fetchJSON';
import { TMDbSearchResponse, TMDbFilm, TMDbFilmFull } from '../types/types';
import { TMDb_API, TMDb_GENRES } from '../util/constants';

/** Gets most popular films from TMDb API */
export const discover = (req: Request, res: Response) => {
  fetchJSON({
    url: `${TMDb_API}/discover/movie?api_key=${process.env.TMDbAPI_KEY}`,
    method: 'get'
  })
    .then((data: TMDbSearchResponse) => {
      // Converting genre_ids[] to string[] of genres names
      const results: TMDbFilm[] = data.results.map((result) => {
        const genres = result.genre_ids.map((id) => {
          return { id, name: TMDb_GENRES[id] };
        });
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
    url: `${TMDb_API}/search/movie?api_key=${process.env.TMDbAPI_KEY}&query=${title}&append_to_response=credits`,
    method: 'get'
  })
    .then((data: TMDbSearchResponse) => {
      const results: TMDbFilm[] = data.results.map((result) => {
        const genres = result.genre_ids.map((id) => {
          return { id, name: TMDb_GENRES[id] };
        });
        delete result.genre_ids;
        return { ...result, genres };
      });
      res.status(200).send(results);
    })
    .catch(() => res.status(400).json('Unable to work with API'));
};

export const getFilm = (req: Request, res: Response) => {
  const { id } = req.params;
  fetchJSON({
    url: `${TMDb_API}/movie/${id}?api_key=${process.env.TMDbAPI_KEY}&append_to_response=credits`,
    method: 'get'
  })
    .then((data: TMDbFilmFull) => {
      res.status(200).send(data);
    })
    .catch(() => res.status(400).json('Unable to work with API'));
};
