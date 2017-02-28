import React, { Component, PropTypes } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'
// Needed for onTouchTap
injectTapEventPlugin()

import Nav from './Nav'
import Login from './Login'

// Change theme for Mui
import muiTheme from '../styles/muiTheme'


// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: false,
    }
  }
  render() {
    if (this.state.isLoggedIn) {
      return (
        <div>
          <MuiThemeProvider muiTheme={muiTheme}>
              <Nav />
          </MuiThemeProvider>
        </div>
      )
    } else {
      return (
        <div>
          <MuiThemeProvider muiTheme={muiTheme}>
              <Login />
          </MuiThemeProvider>
        </div>
      )
    }
  }
}

export default App
