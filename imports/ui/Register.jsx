import React from 'react'

import EmailPassword from './forms/EmailPassword'

//Add Login link

class Register extends React.Component {

  createUser(e) {
    e.preventDefault()
    const
      email = $('#email').val(),
      password = $('#password').val().trim()


    Accounts.createUser(
      {
        email: email,
        password: password
      },
      function(error) {
        if (error) {
          console.log("there was an error: " + error.reason)
        } else {
          console.log('hi')
        }
      }
    )
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-6 col-md-offset-3">
          <h1>Register</h1>
            <EmailPassword
              submitBtnLabel="Register"
              submitAction={this.createUser}
            />
           {this.props.loginLink}
        </div>
      </div>
    )
  }
}

export default Register
