import { DbImage } from "./dbImage";

export interface Movie {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: 'en' | 'es' | 'fr' | string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    backdrops?: DbImage[];
    posters?: DbImage[];
}

export interface GetMovieReturn {
    adult: boolean;
    backdrop_path: string;
    genres: Genre[];
    id: number;
    imdb_id: number;
    original_language: 'en' | 'es' | 'fr' | string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    production_companies: ProductionCompany[];
    production_countries: any[];
    release_date: string;
    revenue: number;
    runtime: number;
    spoken_languages: any[];
    status: string;
    tagline: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
    backdrops?: DbImage[];
    posters?: DbImage[];
}

export interface Genre {
    id: number;
    name: string;
}

export interface ProductionCompany {
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
}