import React, { Component, PropTypes } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'
// Needed for onTouchTap
injectTapEventPlugin()

import Nav from './Nav'
import Login from './Login'
import UserIsMobile from './UserIsMobile'

// Change theme for Mui
import muiTheme from '../styles/muiTheme'


// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: false,
      userIsMobile: false,
      isFirst: false
    }
  }

  changeLoginState (isLogged) {
    this.setState({ isLoggedIn: isLogged })
  }

  changeMobileState () {
    this.setState({ userIsMobile: false })
  }

  isTouchDevice () {
    return 'ontouchstart' in window
  }

  componentWillMount() {
    if (this.isTouchDevice()) {
      this.setState({userIsMobile: true})
    }
  }

  render() {
    if (this.state.isLoggedIn && this.state.userIsMobile) {
      return (
        <div className="app">
          <MuiThemeProvider muiTheme={muiTheme}>
              <UserIsMobile changeMobileState={(mobileState) => this.changeMobileState(mobileState)}/>
          </MuiThemeProvider>
        </div>
      )
    } else if (this.state.isLoggedIn) {
      return (
        <div className="app">
          <MuiThemeProvider muiTheme={muiTheme}>
              <Nav changeLoginState={(isLogged) => this.changeLoginState(isLogged)}/>
          </MuiThemeProvider>
        </div>
      )
    } else {
      return (
        <div className="app">
          <MuiThemeProvider muiTheme={muiTheme}>
              <Login changeLoginState={(isLogged) => this.changeLoginState(isLogged)}/>
          </MuiThemeProvider>
        </div>
      )
    }
  }
}

export default App
