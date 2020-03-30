type TMDbSearchResult = {
  popularity: number;
  vote_count: number;
  video: boolean;
  poster_path: string;
  id: number;
  adult: boolean;
  backdrop_path: string;
  original_language: string;
  original_title: string;
  genre_ids: number[];
  title: string;
  vote_average: number;
  overview: string;
  release_date: string;
};

export interface TMDbSearchResponse {
  page: number;
  total_results: 10000;
  total_pages: 500;
  results: TMDbSearchResult[];
}

export interface TMDbFilm {
  popularity: number;
  vote_count: number;
  video: boolean;
  poster_path: string;
  id: number;
  adult: boolean;
  backdrop_path: string;
  original_language: string;
  original_title: string;
  genres: { id: number; name: string }[];
  title: string;
  vote_average: number;
  overview: string;
  release_date: string;
}

type TMDbCollection = {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
};

type TMDbProductionCompany = {
  id: number;
  logo_path: string;
  name: string;
  original_country: string;
};

type TMDbProductionCountry = {
  iso_3166_1: string;
  name: string;
};

type TMDbSpokenLanguages = {
  iso_639_1: string;
  name: string;
};

type TMDbCastMember = {
  cast_id: number;
  character: string;
  credit_id: string;
  gender: number;
  id: number;
  name: string;
  order: number;
  profile_path: string;
};

type TMDbCrewMember = {
  credit_id: string;
  department: string;
  gender: number;
  id: number;
  job: string;
  name: string;
  profile_path: string;
};

export interface TMDbFilmFull extends TMDbFilm {
  belongs_to_collection: TMDbCollection | null;
  budget: number;
  revenue: number;
  genres: { id: number; name: string }[];
  homepage: string;
  imdb_id: string;
  production_companies: TMDbProductionCompany[] | null;
  production_countries: TMDbProductionCountry[];
  spoken_languages: TMDbSpokenLanguages[] | null;
  status: string;
  tagline: string;
  credits: {
    cast: TMDbCastMember[];
    crew: TMDbCrewMember[];
  };
}
