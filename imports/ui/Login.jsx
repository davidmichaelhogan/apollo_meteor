import React from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: null,
      text: null,
      button: 'Submit'
    }
  }

  handleClick = () => {
    Meteor.call('login', text, function(error, result) {
      this.setState({ canLogin: result })
    })
  }

  render() {
    return (
      <div className="login">
        <div className="sub-header">Please type access key to login:</div>
        <TextField hintText="000000" onChange={(event, value) => this.setState({ text: value })}/><br />
        <RaisedButton label={this.state.button} onTouchTap={() => {
          if (this.state.text == '0117') {
            this.props.changeLoginState(true)
          } else {
            this.setState({ button: 'Nope'})
          }}}
         />
      </div>
    )
  }
}

export default Login
