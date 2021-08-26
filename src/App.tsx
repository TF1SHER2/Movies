import './App.css';
import MoviesList from './components/MoviesList/MoviesList';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import NavBar from './components/NavBar/NavBar';
import MovieDetail from './components/MovieDetail/MovieDetail';

function App() {
  return (
    <div className="App">
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/moviesList">
            <MoviesList
              type="popular"
            />
          </Route>
          <Route path="/movie/:id">
            <MovieDetail />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
