import React from 'react'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: null
    }
  }
  render() {
    return (
      <div>
        <div className="title">Click to Login</div>
        <button onClick={() => this.props.changeLoginState(true)}>Login</button>
      </div>
    )
  }
}

export default Login
