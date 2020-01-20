import React, { Fragment } from 'react';
import './App.css';

//Import components
import Landing from './components/layouts/Landing';
import NavBar from './components/layouts/Navbar';

const App = () => {
  return (
    <Fragment>
      <NavBar />
      <Landing />
    </Fragment>
  );
};

export default App;
