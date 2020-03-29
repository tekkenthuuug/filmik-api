export interface TMDbFilmSearch {
  page: number;
  total_results: 10000;
  total_pages: 500;
  results: {
    popularity: number;
    vote_count: number;
    video: boolean;
    poster_path: string;
    id: string;
    adult: boolean;
    backdrop_path: string;
    original_language: string;
    original_title: string;
    genre_ids: number[];
    title: string;
    vote_average: number;
    overview: string;
    release_date: string;
  }[];
}

export interface FilmFull {
  popularity: number;
  vote_count: number;
  video: boolean;
  poster_path: string;
  id: string;
  adult: boolean;
  backdrop_path: string;
  original_language: string;
  original_title: string;
  genres: string[];
  title: string;
  vote_average: number;
  overview: string;
  release_date: string;
}
