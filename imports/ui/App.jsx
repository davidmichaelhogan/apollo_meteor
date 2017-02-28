import React, { Component, PropTypes } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'
// Needed for onTouchTap
injectTapEventPlugin()

import Nav from './Nav'

// Change theme for Mui
import muiTheme from '../styles/muiTheme'


// App component - represents the whole app
class App extends Component {
  render() {
    return (
      <div>
        <MuiThemeProvider muiTheme={muiTheme}>
          <Nav />
        </MuiThemeProvider>
      </div>
    )
  }
}

export default App
