import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import styles from './Home.module.css';

const Home = () => (
  <div className={styles.Home}>
    <div className={styles.Logo}></div>
    <div className={styles.ButtonRow}>
      <Button href={process.env.PUBLIC_URL + "/moviesList"} variant="info" className={styles.NavButton}>View Popular Movies!</Button>
    </div>
  </div>
);

export default Home;
