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
import CourseDetail from './components/CourseDetail';
import Forbidden from './components/Forbidden';
import UnhandledError from './components/UnhandledError';
import CreateCourse from './components/CreateCourse';
import PrivateRoute from './PrivateRoute';
import UpdateCourse from './components/UpdateCourse';
const UserSignUpWithContext = withContext(UserSignUp);
const UserSignInWithContext = withContext(UserSignIn);
const HeaderWithContext = withContext(Header);
const UserSignOutWithContext = withContext(UserSignOut);

const App = () => (
  <Router>
      <HeaderWithContext />
      <Switch>
        <Route exact path="/" component={Courses} /> 
        <Route path="/signin" component={UserSignInWithContext} />
        <Route path="/signup" component={UserSignUpWithContext} />
        <Route path="/signout" component={UserSignOutWithContext} />
        <PrivateRoute path="/courses/create" component={CreateCourse} />
        <PrivateRoute path="/courses/:id/update" component={UpdateCourse} />
        <Route path="/courses/:id" component={CourseDetail} />
        <Route path="/forbidden" component={Forbidden} />
        <Route path="/error" component={UnhandledError} />
        <Route component={NotFound} />
      </Switch>
  </Router>
)

export default App;
