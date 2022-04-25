import React, { Component } from 'react';
import Cookies from 'js-cookie';

import Data from './Data';

export const Context = React.createContext(); 

export class Provider extends Component {

 
  constructor() {
    super();
    this.data = new Data();
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

  
  signIn = async (emailAddress, password) => {
    const user = await this.data.getUser(emailAddress, password);
    if (user !== null){
      this.setState(()=>{
        return {
          authenticatedUser: user,
          credential:{emailAddress, password},
        };
      });
      Cookies.set('authenticatedUser', JSON.stringify(user),{expires:1}); //cookie expires in 1 day
      Cookies.set('credential', JSON.stringify({emailAddress,password}), {expires:1})
    }
    return user;
  }

  signOut = () => {
    this.setState(()=>{
      return {
        authenticatedUser: null,
        credential:null
      }
    });
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

