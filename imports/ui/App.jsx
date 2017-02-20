import React, { Component, PropTypes } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

import Nav from './Nav'

// App component - represents the whole app
class App extends Component {
  render() {
    return (
      <div>
        <MuiThemeProvider>
          <Nav />
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App
