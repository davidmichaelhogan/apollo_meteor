import React from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: null,
      password: null,
      text: 'Please Login to continue.'
    }
  }

  loginWithPassword = (e) => {
    e.preventDefault();
    const email = this.state.email, password = this.state.password

    Meteor.loginWithPassword(email, password, (error) => {
      if (error) {
        console.log("There was an error:" + error.reason);
        this.setState({ text: error.reason })
      } else {
        this.props.changeLoginState(true)
      }
    })
  }

  render() {
    return (
      <div className="login">
      <div className="title center">Apollo Ad Network</div>
        <div className="sub-header">{this.state.text}</div>
        <TextField hintText="Email" onChange={(event, value) => this.setState({ email: value })}/><br />
        <TextField hintText="Password" type="password" onChange={(event, value) => this.setState({ password: value })}/><br />
        <RaisedButton label="Submit" onTouchTap={this.loginWithPassword}
         />
      </div>
    )
  }
}

export default Login
