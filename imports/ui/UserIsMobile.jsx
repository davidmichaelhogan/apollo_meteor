import React from 'react'

import RaisedButton from 'material-ui/RaisedButton'

class UserIsMobile extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
    }
  }

  changeState = () => {
    this.props.changeMobileState(false)
  }

  render() {
    return (
      <div>
        <div className="mobile-user">
          <div className="title center"><img src="img/logo.jpg" /></div>
          <div className="mobile-title">Thanks for Registering!</div>
          <div className="mobile-subtitle">Just so you know, Apollo works best on a desktop environment. You may continue below, but we suggest you come back when you're on a computer. </div>
          <RaisedButton secondary={true} label="Continue" onTouchTap={this.changeState}/>
          <div className="mobile-email">
            <span><a href="mailto:team@apollomobileads.com">team@apollomobileads.com</a></span>
          </div>
        </div>
      </div>
    )
  }
}

export default UserIsMobile
