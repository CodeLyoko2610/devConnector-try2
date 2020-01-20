import React, { Fragment } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

//Import components
import Landing from './components/layouts/Landing';
import NavBar from './components/layouts/Navbar';
import Register from './components/auth/Register';
import Login from './components/auth/Login';

const App = () => {
  return (
    <Router>
      <Fragment>
        <NavBar />
        <Route exact path='/' component={Landing} />

        <section className='container'>
          <Switch>
            <Register exact path='/register' component={Register} />
            <Login exact path='/login' component={Login} />
          </Switch>
        </section>
      </Fragment>
    </Router>
  );
};

export default App;
