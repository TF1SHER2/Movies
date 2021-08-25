import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { map } from 'lodash';
import { Movie } from '../../models/movie';
import styles from './MovieCarousel.module.css';
import theMovieDb from '../../lib/theMovieDb/themoviedb';

export interface MovieCarouselProps {
  movies: Movie[];
}

const MovieCarousel = ({
  movies
}: MovieCarouselProps): JSX.Element => {
  const [curSlice, setCurSlice] = useState<Movie[]>(movies);

  useEffect(() => {
    if (movies) {
      // setCurSlice([...movies.slice(0, 5)]);
      setCurSlice([...movies]);
    }
  }, [movies]);

  const getPosterPathImgSrc: (movie: Movie) => string = (movie: Movie) => {
    let src = "";
    if (movie.poster_path) {
      src = 'https://image.tmdb.org/t/p/w185/' + movie.poster_path;
    }
    return src;
  }

  return (
    <Container className={styles.MovieCarousel}>
      <Row className={styles.PreviewRow}>
        {map(curSlice, (movie: Movie, index) => {return(
          <Col xs={6} md={4} lg={3} xl={2} key={movie.id}>
            <a href={"/movie/" + movie.id} className={styles.MovieCard}>
              <div className={styles.MovieImageWrap}>
                <img className={styles.MovieImage} src={getPosterPathImgSrc(movie)} />
              </div>
              <div className={styles.MovieDetails}>
                <div>{movie.title}</div>
                <div>{new Date(movie.release_date).getFullYear()}</div>
                <div>{movie.vote_average}/10</div>
              </div>
            </a>
          </Col>
        )})}
      </Row>
    </Container>
  )
};

export default MovieCarousel;
