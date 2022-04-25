import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Form from './Form';

export default class UserSignIn extends Component {
  // Intialize emailAddress, password and error states.
  state = {
    emailAddress: '',
    password: '',
    errors: [],
  }

  render() {
    const {
      emailAddress,
      password,
      errors,
    } = this.state;

    return (
      <main>
      <div className="form--centered">
          <h2>Sign In</h2>
          <Form 
            cancel={this.cancel}
            errors={errors}
            submit={this.submit}
            submitButtonText="Sign In"
            elements={() => (
              <React.Fragment>
                <label htmlFor="emailAddress">Email Address</label>
                <input 
                  id="emailAddress" 
                  name="emailAddress" 
                  type="email"
                  value={emailAddress} 
                  onChange={this.change} 
                />
                <label htmlFor="password">Password</label>
                <input 
                  id="password" 
                  name="password"
                  type="password"
                  value={password} 
                  onChange={this.change} 
                  placeholder="Password" />                
              </React.Fragment>
            )} />
          <p>Don't have a user account? Click here to <Link to="/signup">sign up</Link>!</p>
        </div>
      </main>
    );
  }

  change = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
      return {
        [name]: value
      };
    });
  }

  submit = () => {
    // EXCEED From referrer or set to index page
    const { from } = this.props.location.state || { from: {pathname: '/'}};
    
    // Calls signIn from context.action
    const { context } = this.props;
    const { emailAddress, password } = this.state;
    context.actions.signIn(emailAddress, password)
      .then( user => {
        // If user not found sets error state with Sign-in unsuccess.
        if (user === null){
          this.setState(()=>{
            return { errors: ['Sign-in was unsuccessful']};
          });
        }else {
          //EXCEED redirect the user to from
          this.props.history.push(from);
          console.log(`SUCCESS ${emailAddress} is now signed in!`);
        }
      })
      .catch( err => {
        // For all other errors send to unhandled error page
        console.log(err);
        this.props.history.push('/error');
      });

  }

  cancel = () => {
    // On cancel send back to index page
    this.props.history.push('/')
  }
}
