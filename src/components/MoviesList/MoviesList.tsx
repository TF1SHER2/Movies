import React, { useCallback, useEffect, useState } from 'react';
import { Button, Col, FormControl, InputGroup, Row } from 'react-bootstrap';
import theMovieDb from '../../lib/theMovieDb/themoviedb';
import { DbImage } from '../../models/dbImage';
import { Movie } from '../../models/movie';
import MovieCarousel from '../MovieCarousel/MovieCarousel';
import classNames from 'classnames';
import styles from './MoviesList.module.css';
import { map } from 'lodash';
import MobileNav from '../MobileNav/MobileNav';

export interface MoviesListProps {
  type: 'nowPlaying' | 'topRated' | 'popular' | 'search';
}

export interface ImagesReturn {
  id: Number;
  backdrops: DbImage[];
  posters: DbImage[];
}

const MoviesList = ({
  type: iType,
}: MoviesListProps): JSX.Element => {
  
  const [type, setType] = useState<'nowPlaying' | 'topRated' | 'popular' | 'search'>(iType);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [popularPages, setPopularPages] = useState<number[]>([]);
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
  const [nowPlayingPages, setNowPlayingPages] = useState<number[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [topRatedPages, setTopRatedPages] = useState<number[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [searchPages, setSearchPages] = useState<number[]>([]);
  const [curShowing, setCurShowing] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [curPages, setCurPages] = useState<number[]>([]);
  const [curPageNo, setCurPageNo] = useState<number>(1);
  const [displayPageNos, setDisplayPageNos] = useState<number[]>([1, 2, 3, 4, 5]);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  useEffect(() => {
    if (nowPlaying && popular && topRated) {
      if (type === 'nowPlaying') {
        setCurShowing(nowPlaying);
        if (nowPlayingPages) {
          setCurPages(nowPlayingPages);
        }
      } else if (type === 'topRated') {
        setCurShowing(topRated);
        if (topRatedPages) {
          setCurPages(topRatedPages);
        }
      } else if (type === 'popular') {
        setCurShowing(popular);
        if (popularPages) {
          setCurPages(popularPages);
        }
      } else if (type === 'search') {
        setCurShowing(searchResults);
        if (searchPages) {
          setCurPages(searchPages);
        }
      }
      setIsLoaded(true);
    }
  }, [
    nowPlaying,
    popular,
    topRated,
    searchResults,
    type,
    nowPlayingPages,
    topRatedPages,
    popularPages,
    searchPages
  ]);
  
  const getImages: (movieId: Number) => ImagesReturn | null = (movieId: Number) => {
    let data: ImagesReturn | null = null;
    if (movieId) {
      theMovieDb.movies.getImages({id: movieId},
        function(moviesReturn: any) {
          moviesReturn = JSON.parse(moviesReturn)
          data = moviesReturn as ImagesReturn;
        },
        function(error: any) {
          console.error(error);
        }
      );
    }
    return data;
  };

  const getNowPlaying: (pageNum: number) => void = (pageNum: number) => {
    theMovieDb.movies.getNowPlaying({page: pageNum},
      function(moviesReturn: any) {
        moviesReturn = JSON.parse(moviesReturn)
        if (moviesReturn.results && moviesReturn.results.length > 0) {
          setNowPlaying(moviesReturn.results);
        }
        if (moviesReturn.total_pages) {
          let pageNums: number[] = [];
          for (let i = 0; i < moviesReturn.total_pages; i++) {
            pageNums.push(i+1);
          }
          setNowPlayingPages(pageNums);
          updateDisplayPageNos(pageNums, pageNum);
        }
      }, 
      function(error: any) {
        console.error(error);
      }
    );
  };
  const getPopular: (pageNum: number) => void = (pageNum: number) => {
    theMovieDb.movies.getPopular({page: pageNum},
      function(moviesReturn: any) {
        moviesReturn = JSON.parse(moviesReturn)
        if (moviesReturn.results && moviesReturn.results.length > 0) {
          setPopular(moviesReturn.results);
        }
        if (moviesReturn.total_pages) {
          let pageNums: number[] = [];
          for (let i = 0; i < moviesReturn.total_pages; i++) {
            pageNums.push(i+1);
          }
          setPopularPages(pageNums);
          updateDisplayPageNos(pageNums, pageNum);
        }
      }, 
      function(error: any) {
        console.error(error);
      }
    );
  };
  const getTopRated: (pageNum: number) => void = (pageNum: number) => {
    theMovieDb.movies.getTopRated({page: pageNum},
      function(moviesReturn: any) {
        moviesReturn = JSON.parse(moviesReturn)
        if (moviesReturn.results && moviesReturn.results.length > 0) {
          let topRated: Movie[] = [...moviesReturn.results];
          // set images - does not return much data,
          // commenting out to save network calls
          // map(topRated, (topRatedMovie: Movie) => {
          //   let movieImages: ImagesReturn | null = getImages(topRatedMovie.id);
          //   if (movieImages?.backdrops) {
          //     topRatedMovie.backdrops = movieImages.backdrops;
          //   }
          //   if (movieImages?.posters) {
          //     topRatedMovie.posters = movieImages.posters;
          //   }
          // });
          setTopRated(topRated);
        }
        if (moviesReturn.total_pages) {
          let pageNums: number[] = [];
          for (let i = 0; i < moviesReturn.total_pages; i++) {
            pageNums.push(i+1);
          }
          setTopRatedPages(pageNums);
          updateDisplayPageNos(pageNums, pageNum);
        }
      }, 
      function(error: any) {
        console.error(error);
      }
    );
  };

  useEffect(() => {
    if (!isLoaded && theMovieDb) {
      getNowPlaying(1);
      getPopular(1);
      getTopRated(1);
    }
  }, [isLoaded]);

  const getSearchResults: (pageNo: number) => void = (pageNo: number) => {
    theMovieDb.search.getMovie({query: searchTerm, page: pageNo},
      function(moviesReturn: any) {
        moviesReturn = JSON.parse(moviesReturn)
        if (moviesReturn.results) {
          setSearchResults(moviesReturn.results);
        }
        if (moviesReturn.total_pages) {
          let pageNums: number[] = [];
          for (let i = 0; i < moviesReturn.total_pages; i++) {
            pageNums.push(i+1);
          }
          setSearchPages(pageNums);
          updateDisplayPageNos(pageNums, pageNo);
        }
      }, 
      function(error: any) {
        console.error(error);
      }
    );
  }

  const onPageClick: (pageNo: number, iType?: 'nowPlaying' |  'popular' | 'topRated' | 'search') => void
    = (pageNo: number, iType?: 'nowPlaying' |  'popular' | 'topRated' | 'search') => {

    const typeToCheck = iType ? iType : type;
    if (typeToCheck === 'nowPlaying') {
      getNowPlaying(pageNo);
    } else if (typeToCheck === 'popular') {
      getPopular(pageNo);
    } else if (typeToCheck === 'topRated') {
      getTopRated(pageNo);
    } else if (typeToCheck === 'search') {
      getSearchResults(pageNo);
    }
    setCurPageNo(pageNo);
  };

  const updateDisplayPageNos: (newPages: number[], pageNo: number) => void = (newPages: number[], pageNo: number) => {
    if (newPages.length >= 5 && pageNo == 1) {
      setDisplayPageNos([pageNo, pageNo + 1, pageNo + 2, pageNo + 3, pageNo + 4]);
    } else if (newPages.length >= 5 && pageNo == 2) {
      setDisplayPageNos([pageNo - 1, pageNo, pageNo + 1, pageNo + 2, pageNo + 3]);
    } else if (newPages.length >= 5 && pageNo >= 3 && pageNo <= newPages.length - 2) {
      setDisplayPageNos([pageNo - 2, pageNo - 1, pageNo, pageNo + 1, pageNo + 2]);
    } else if (newPages.length >= 5 && pageNo === newPages.length - 1) {
      setDisplayPageNos([pageNo - 3, pageNo - 2, pageNo - 1, pageNo, pageNo + 1]);
    } else if (newPages.length >= 5 && pageNo === newPages.length) {
      setDisplayPageNos([pageNo - 4, pageNo - 3, pageNo - 2, pageNo - 1, pageNo]);
    } else if (newPages.length === 4) {
      setDisplayPageNos([1, 2, 3, 4]);
    } else if (newPages.length === 3) {
      setDisplayPageNos([1, 2, 3]);
    } else if (newPages.length === 2) {
      setDisplayPageNos([1, 2]);
    } else if (newPages.length === 1) {
      setDisplayPageNos([1]);
    }
  };

  return (
    <div className={styles.MoviesList}>
      {isMobileNavOpen && (
        <MobileNav
          type={type}
          onClose={() => {setIsMobileNavOpen(false)}}
          onSetType={(type: 'nowPlaying' |  'popular' | 'topRated' | 'search') => {
            setType(type);
            onPageClick(1, 'popular');
            setIsMobileNavOpen(false);
          }}
        />
      )}
      <Row className={styles.TabRow}>
        <Col className={styles.TabCol} onClick={() => {
          setType('nowPlaying');
          onPageClick(1, 'nowPlaying');
        }}>
          <div className={classNames(styles.Tab,
            { [styles.ActiveTab]: type === 'nowPlaying' })}>Now Playing</div>
        </Col>
        <Col className={styles.TabCol} onClick={() => {
          setType('popular');
          onPageClick(1, 'popular');
        }}>
          <div className={classNames(styles.Tab,
            { [styles.ActiveTab]: type === 'popular' })}>Popular</div>
        </Col>
        <Col className={styles.TabCol} onClick={() => {
          setType('topRated');
          onPageClick(1, 'topRated');
        }}>
          <div className={classNames(styles.Tab,
            { [styles.ActiveTab]: type === 'topRated' })}>Top Rated</div>
        </Col>
        <Col xs="auto" className={styles.TriangleCol}>
          <div className={classNames(styles.Triangle,
            { [styles.Active]: type === 'search' })}></div>
        </Col>
        <Col className={styles.MenuCol} xs="auto"
          onClick={() => {setIsMobileNavOpen(!isMobileNavOpen)}}>
          <div className={styles.MenuIcon}>
            &mdash;<br/>
            &mdash;<br/>
            &mdash;<br/>
          </div>
        </Col>
        <Col xs md="auto" className={styles.SearchCol}>
          <div className={styles.SearchTab}>
            <InputGroup>
              <FormControl
                className={styles.SearchInput}
                placeholder="Search Movies!"
                aria-label="Movies Search"
                aria-describedby="basic-addon2"
                value={searchTerm}
                onChange={(eventData) => {
                  setSearchTerm(eventData.target.value);
                }}
              />
              <Button
                variant="secondary"
                id="button-addon2"
                className={styles.SearchButton}
                onClick={()=>{
                  setType('search');
                  onPageClick(1, 'search');
                }}>
                Search!
              </Button>
            </InputGroup>
          </div>
        </Col>
      </Row>
      <div className={styles.MovieCarouselRow}>
        <div className={styles.MovieCarouselWrap}>
          <MovieCarousel
            movies={curShowing}
          />
        </div>
      </div>
      <div className={styles.PageWrap}>
        <Row className={styles.PagesRow}>
          <Col
            xs={'auto'}
            className={classNames([styles.PageNo, styles.Symbol, styles.MobileDisplayToggle])}
            onClick={() => {
              if (curPageNo - 1 >= 1) {
                onPageClick(curPageNo - 1);
              } else {
                onPageClick(1);
              }
            }}>
              &lt;
          </Col>
          {curPages.length > 6 && (curPageNo > 3) && (
            <>
              <Col
                xs={'auto'}
                className={styles.PageNo}
                onClick={() => {
                  onPageClick(1);
                }}>1</Col>
              <Col className={classNames(styles.EllipsisCol, styles.MobileDisplayToggle)}
                xs={'auto'}>&#8230;</Col>
            </>
          )}
          {map(displayPageNos, (pageNo: number) => {return(
            <Col
              className={classNames(styles.PageNo,
                { [styles.ActivePage]: curPageNo === pageNo })}
              onClick={()=>{onPageClick(pageNo)}}
              xs={'auto'}
              key={pageNo}>
                {pageNo}
            </Col>
          )})}
          {curPages.length > 6 && (curPageNo <= curPages.length - 3) && (
            <>
              <Col className={classNames(styles.EllipsisCol, styles.MobileDisplayToggle)}
                xs={'auto'}>&#8230;</Col>
              <Col
                xs={'auto'}
                className={classNames(styles.PageNo)}
                onClick={() => {
                  onPageClick(curPages.length);
                }}
              >{curPages.length}</Col>
            </>
          )}
          <Col
            xs={'auto'}
            className={classNames([styles.PageNo, styles.Symbol, styles.MobileDisplayToggle])}
            onClick={() => {
              if (curPageNo + 1 < curPages.length) {
                onPageClick(curPageNo + 1);
              } else {
                onPageClick(curPages.length);
              }
            }}>
              &gt;
          </Col>
        </Row>
      </div>
    </div>
  )
};

export default MoviesList;
