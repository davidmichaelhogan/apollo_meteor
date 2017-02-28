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
        <div className="title">Please contact us at: info@launchapollo.com to sign up for advertiser access.</div>
      </div>
    )
  }
}

export default Login
