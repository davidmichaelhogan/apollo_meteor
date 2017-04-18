import React from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: null,
      password: null,
      name: null,
      phone: null,
      website: null,
      login: true,
      loginText: 'Please Login to Continue',
      registerText: 'Sign up for an Advertiser Account'
    }
  }

  createUser = () => {
    const email = this.state.email, password = this.state.password, name = this.state.name, phone = this.state.phone, website = this.state.website
    Meteor.call('sendEmail', { email: email, name: name, phone: phone, website: website })
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
        <div id="login-content" className="login-content">
        <div className="title center"><img src="img/logo.jpg" /></div>
          <div className="sub-header">{this.state.loginText}</div>
          <TextField hintText="Email" onChange={(event, value) => this.setState({ email: value })}/><br />
          <TextField hintText="Password" type="password" onChange={(event, value) => this.setState({ password: value })}/><br />
          <div style={{margin: 20}}>
          <RaisedButton primary={true} label="Submit" onTouchTap={this.loginWithPassword}/>
          </div>
          <p><a id="myLink" href="#" title="Click to Login" onClick={() => this.setState({ login: false })}>I'd like to sign up for an account</a></p>
        </div>
      )
    } else {
      return (
        <div id="login-content" className="login-content">
        <div className="title center"><img src="img/logo.jpg" /></div>
        <div className="sub-header">{this.state.registerText}</div>
        <TextField hintText="Name" onChange={(event, value) => this.setState({ name: value })}/><br />
        <TextField hintText="Email" onChange={(event, value) => this.setState({ email: value })}/><br />
        <TextField hintText="Phone" type="phone" onChange={(event, value) => this.setState({ phone: value })}/><br />
        <TextField hintText="Website" type="website" onChange={(event, value) => this.setState({ website: value })}/><br />
        <TextField hintText="Choose a Password" type="password" onChange={(event, value) => this.setState({ password: value })}/><br />
        <div style={{margin: 20}}>
        <RaisedButton label="Submit" primary={true} onTouchTap={this.createUser} />
        </div>
        <p><a id="myLink" href="#" title="Click to Login" onClick={() => this.setState({ login: true })}>I'm already registered</a></p>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="login">
       {this.showRegistration()}
       <div className="login-sub-text">
       <span>Need to get in touch? Send us an email: <a href="mailto:info@launchapollo.com">info@launchapollo.com</a></span>
       <div className="login-sub-links">
       Copyright © 2017 Apollo Network, LLC. All Rights Reserved. <a href="#">Privacy Policy</a>
       </div>
       </div>
      </div>
    )
  }
}

export default Login
