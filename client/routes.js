import React from 'react'
import { Router, Route } from 'react-router'
import createBrowserHistory from 'history/createBrowserHistory'

import App from '../imports/ui/App'
import Login from '../imports/ui/Login'
import AdsTable from '../imports/ui/AdsTable'

const browserHistory = createBrowserHistory();
export const renderRoutes = () => (
  <Router history={browserHistory}>
    <div>
      <Route path="/" component={App}/>
      <Route exact path="/" component={Login}/>
      <Route path="/table" component={AdsTable}/>
    </div>
  </Router>
)
