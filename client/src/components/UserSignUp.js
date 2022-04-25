import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Form from './Form';

export default class UserSignUp extends Component {
  // Initialize firstName, lastName, emailAddress, password and errors state
  state = {
    firstName: '',
    lastName: '',
    emailAddress: '',
    password: '',
    errors: [],
  }

  render() {
    const {
      firstName,
      lastName,
      emailAddress,
      password,
      errors,
    } = this.state;

    return (
      <main>
      <div className="form--centered">
          <h2>Sign Up</h2>
          <Form 
            cancel={this.cancel}
            errors={errors}
            submit={this.submit}
            submitButtonText="Sign Up"
            elements={() => (
              <React.Fragment>
                <label htmlFor="firstName">First Name</label>
                <input 
                  id="firstName" 
                  name="firstName" 
                  type="text"
                  value={firstName} 
                  onChange={this.change} 
                />
                <label htmlFor="lastName">Last Name</label>
                <input 
                  id="lastName" 
                  name="lastName" 
                  type="text"
                  value={lastName} 
                  onChange={this.change} 
                />
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
          <p>Already have a user account? Click here to <Link to="/signin">sign in</Link>!</p>
        </div>
      </main>
    );
  }

  // Handles on form field change event
  change = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    // updates the state of the targeted form field name.
    this.setState(() => {
      return {
        [name]: value
      };
    });
  }

  // Handles the Sign up button submit event
  submit = () => {
    // Calls createUser from the context.data (Rest API Data class)
    const { context } = this.props;
    const { firstName, lastName, emailAddress, password } = this.state;
    const user = { firstName, lastName, emailAddress, password};
    context.data.createUser(user)
      .then( errors => {
        // If errors array is set update the state
        if (errors.length){
          this.setState({errors});
        } else {
          // If no errors found also performs Sign In 
          context.actions.signIn(emailAddress, password)
            .then(()=>{
              // After success authenticated send to index page
              this.props.history.push('/');
            })
            .catch(()=>{
              // If fail to authenticate send to Unhandled Error page
              this.props.history.push('/error');
            });
            
          console.log(`${emailAddress} is successfully signed up and authenticated!`);   
        }
      })
      .catch( err=>{
        // For all other unhandled errors send to /error page
        console.log(err);
        this.props.history.push('/error');
      })
  }
  // on Cancel button clicked 
  cancel = () => {
    // Send back to index page
    this.props.history.push('/');
  }
}
