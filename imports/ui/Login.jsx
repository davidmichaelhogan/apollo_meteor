import React from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: null,
      password: null,
      login: false,
      loginText: 'Please Login to continue.',
      registerText: 'Register for an Advertiser Account'
    }
  }

  createUser = () => {
    const email = this.state.email, password = this.state.password, name = this.state.name
    Meteor.call('sendEmail', { email: email })
    Accounts.createUser(
      {
        email: email,
        password: password
      },
      (error) => {
        if (error) {
          console.log("there was an error: " + error.reason)
          this.setState({ registerText: error.reason })
        } else {
          Meteor.loginWithPassword(email, password, (error) => {
            if (error) {
              console.log("There was an error:" + error.reason);
              this.setState({ registerText: error.reason })
            } else {
              this.props.changeLoginState(true)
            }
          })
        }
      }
    )
  }

  loginWithPassword = () => {
    const email = this.state.email, password = this.state.password

    Meteor.loginWithPassword(email, password, (error) => {
      if (error) {
        console.log("There was an error:" + error.reason);
        this.setState({ loginText: error.reason })
      } else {
        this.props.changeLoginState(true)
      }
    })
  }

  showRegistration = () => {
    if (this.state.login) {
      return (
        <div className="login">
        <div className="title center">Apollo Ad Network</div>
          <div className="sub-header">{this.state.loginText}</div>
          <TextField hintText="Email" onChange={(event, value) => this.setState({ email: value })}/><br />
          <TextField hintText="Password" type="password" onChange={(event, value) => this.setState({ password: value })}/><br />
          <RaisedButton label="Submit" onTouchTap={this.loginWithPassword}
           />
        </div>
      )
    } else {
      return (
        <div className="login">
        <div className="title center">Apollo Ad Network</div>
        <div className="sub-header">{this.state.registerText}</div>
        <TextField hintText="Email" onChange={(event, value) => this.setState({ email: value })}/><br />
        <TextField hintText="Password" type="password" onChange={(event, value) => this.setState({ password: value })}/><br />
        <RaisedButton label="Submit" onTouchTap={this.createUser} />
        </div>
      )
    }
  }

  render() {
    return (
      <div>
       {this.showRegistration()}
      </div>
    )
  }
}

export default Login
