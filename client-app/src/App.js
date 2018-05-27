import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Navbar from './components/Navbar';
import ProjectPage from './containers/ProjectPage';
import HomePage from './containers/HomePage';
import UserPage from './containers/UserPage';
import SignInPage from './containers/SignInPage';
import LogInPage from './containers/LogInPage'

class App extends React.Component {
    render() {
      return (
        <div>
          <Navbar />
          <Switch>
            <Route path="/" exact component={HomePage} />
            <Route path="/project" component={ProjectPage} />
            <Route path="/user" component={UserPage} />
            <Route path="/sign-in" component={SignInPage}/>
            <Route path="/log-in" component={LogInPage} />
            <Redirect to="/" />
          </Switch>
        </div>
      );
    }
}

export default App