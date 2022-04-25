import React, { Component } from 'react';
import Cookies from 'js-cookie';

import Data from './Data';

export const Context = React.createContext(); 

export class Provider extends Component {

 
  constructor() {
    super();
    this.data = new Data();
    // EXCEEDS with Cookies to store authenticatedUser and credentials
    this.authCookie = Cookies.get('authenticatedUser');
    this.credentialCookie = Cookies.get('credential');
    this.state = {
      authenticatedUser: this.authCookie ? JSON.parse(this.authCookie) : null,
      credential: this.credentialCookie ? JSON.parse(this.credentialCookie): null,
    }
  }

  

  render() {
    const {authenticatedUser, credential} = this.state;

    const value = {
      authenticatedUser,
      credential,
      data: this.data,
      actions: {
        signIn: this.signIn,
        signOut: this.signOut
      }
    };
    return (
      <Context.Provider value={value}>
        {this.props.children}
      </Context.Provider>  
    );
  }

  // Sign In action 
  signIn = async (emailAddress, password) => {
    // Calls Rest API to authenticate User
    const user = await this.data.getUser(emailAddress, password);

    // If User found update the authenticatedUser and credential state
    if (user !== null){
      this.setState(()=>{
        return {
          authenticatedUser: user,
          credential:{emailAddress, password},
        };
      });
      // EXCEED add to cookies
      Cookies.set('authenticatedUser', JSON.stringify(user),{expires:1}); //cookie expires in 1 day
      Cookies.set('credential', JSON.stringify({emailAddress,password}), {expires:1})
    }
    return user;
  }

  // On Sign Out from context.actions
  signOut = () => {
    // Update the authenticatedUser and credential states to null
    this.setState(()=>{
      return {
        authenticatedUser: null,
        credential:null
      }
    });
    //EXCEED remove the cookies
    Cookies.remove('authenticatedUser');
    Cookies.remove('credential');
  }
}

export const Consumer = Context.Consumer;

/**
 * A higher-order component that wraps the provided component in a Context Consumer component.
 * @param {class} Component - A React component.
 * @returns {function} A higher-order component.
 */

export default function withContext(Component) {
  return function ContextComponent(props) {
    return (
      <Context.Consumer>
        {context => <Component {...props} context={context} />}
      </Context.Consumer>
    );
  }
}

