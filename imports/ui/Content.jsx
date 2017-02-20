import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AdsTable from './AdsTable'
import AdsStepper from './AdsStepper'



export default class Content extends React.Component {
  render() {
    console.log (this.props.currentPage)
    if (this.props.currentPage == 0) {
    return (
      <MuiThemeProvider>
        <AdsStepper />
      </MuiThemeProvider>
    )
  } else {
    return (
      <div>
        <h2>Your Current Ad Campaigns</h2>
        <MuiThemeProvider>
          <AdsTable />
        </MuiThemeProvider>
      </div>
    )}
  }
}
