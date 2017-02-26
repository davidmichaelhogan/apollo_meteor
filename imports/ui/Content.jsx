import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AdsTable from './AdsTable'
import AdsStepper from './AdsStepper'

import muiTheme from '../styles/muiTheme'

export default class Content extends React.Component {
  render() {
    if (this.props.currentPage == 0) {
    return (
      <div>
        <MuiThemeProvider muiTheme={muiTheme}>
          <AdsTable />
          </MuiThemeProvider>
      </div>
    )
  } else {
    return (
      <div>
        <MuiThemeProvider muiTheme={muiTheme}>
          <AdsStepper />
        </MuiThemeProvider>
      </div>
    )}
  }
}
