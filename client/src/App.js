import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import Header from './components/Header';
import Courses from './components/Courses';
import NotFound from './components/NotFound';
import withContext from './Context';
import UserSignUp from './components/UserSignUp';
import UserSignIn from './components/UserSignIn';
import UserSignOut from './components/UserSignOut';
import Authenticated from './components/Authenticated';
import CourseDetail from './components/CourseDetail';

const UserSignUpWithContext = withContext(UserSignUp);
const UserSignInWithContext = withContext(UserSignIn);
const HeaderWithContext = withContext(Header);

const App = () => (
  <Router>
      <HeaderWithContext />
      <Switch>
        <Route exact path="/" component={Courses} />
        <Route path="/authenticated" component={Authenticated} />
        <Route path="/signin" component={UserSignInWithContext} />
        <Route path="/signup" component={UserSignUpWithContext} />
        <Route path="/signout" component={UserSignOut} />
        <Route path="/courses/:id" component={CourseDetail} />
        <Route component={NotFound} />
      </Switch>
  </Router>
)

export default App;
