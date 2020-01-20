import React, { Fragment } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

//Import components
import Landing from './components/layouts/Landing';
import NavBar from './components/layouts/Navbar';

const App = () => {
  return (
    <Router>
      <Fragment>
        <NavBar />
        <Route exact path='/' component={Landing} />
      </Fragment>
    </Router>
  );
};

export default App;
