import React, { useEffect, useState } from 'react';
import styles from './MovieDetail.module.css';
import { useParams } from 'react-router-dom';
import theMovieDb from '../../lib/theMovieDb/themoviedb';
import { Container, Row, Col } from 'react-bootstrap';
import { Genre, GetMovieReturn } from '../../models/movie';
import { map } from 'lodash';

const MovieDetail = (): JSX.Element => {

  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<GetMovieReturn>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  
  useEffect(() => {
    theMovieDb.movies.getById({id: +id},
      function(movieReturn: any) {
        const movieReturnData: GetMovieReturn = JSON.parse(movieReturn);
        setMovie(movieReturnData);
        console.log(movieReturnData);
      }, 
      function(error: any) {
        console.error(error);
      }
    );
  }, [id]);
  const getPosterPathImgSrc: (movie: GetMovieReturn) => string = (movie: GetMovieReturn) => {
    let src = "";
    if (movie.poster_path) {
      src = 'https://image.tmdb.org/t/p/original/' + movie.poster_path;
    }
    return src;
  }
  return (
    <div className={styles.MovieDetail}>
      {movie && (
        <>
          <a href={"/moviesList"} className={styles.Back}>
            &lt;&nbsp;
            <span className={styles.BackText}>Back</span>
          </a>
          <Row className={styles.MovieDetailRow}>
            <Col xs={12} md={4} sm className={styles.MovieImageCol}>
              <img className={styles.MovieImage} src={getPosterPathImgSrc(movie)} />
            </Col>
            <Col>
              <div className={styles.DetailsWrap}>
                <div className={styles.Title}>{movie.title}</div>
                {movie.tagline.length > 0 && (
                  <div className={styles.Tagline}>{movie.tagline}</div>
                )}
                <div className={styles.pb1}>{movie.overview}</div>
                <div className={styles.pb1}>Length: {movie.runtime} minutes</div>
                <div className={styles.pb1}>Released On:{movie.release_date}</div>
                <div className={styles.pb1}>Rating: {movie.popularity} / 100</div>
                <div className={styles.pb1}>Total votes: {movie.vote_count}</div>
                {movie.genres.length > 0 && (
                  <>
                    <div>Genres:</div>
                    <ul>
                      {map(movie.genres, (genre: Genre) => {
                        return <li key={genre.id}>{genre.name}</li>
                      })}
                    </ul>
                  </>
                )}
              </div>
            </Col>
          </Row>
        </>
      )}
    </div>
  )
};

export default MovieDetail;
