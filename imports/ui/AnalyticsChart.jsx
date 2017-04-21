import React from 'react'
import { Mongo } from 'meteor/mongo'
import { createContainer } from 'meteor/react-meteor-data'
import IconMenu from 'material-ui/IconMenu'
import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more'
import MenuItem from 'material-ui/MenuItem'
import DropDownMenu from 'material-ui/DropDownMenu'
import RaisedButton from 'material-ui/RaisedButton'
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { uniq } from 'lodash'

import { Events } from '../api/events.js'
import { Ads } from '../api/ads.js'
import { Analytics } from '../api/analytics.js'

class AnalyticsChart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      //Set menu to first Ad
      value: this.props.ads[0]._id
    }
  }

  handleChange = (event, index, value) => this.setState({value})

  handleDownload = () => {
    console.log('download that shit')
    Meteor.call('downloadCSV', { ad_id: this.state.value})
  }

  renderChart() {
    //Key corresponding with each ad and written in data object
    const dataKey = this.props.analytics.map((ad) => {
      return ad._id
    })
    let key = this.state.value
    let currentAd = this.props.analytics[dataKey.indexOf(key)]
    if (currentAd) {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={currentAd.data.slice(currentAd.data.length - 31, currentAd.data.length)}>
            <XAxis dataKey={"date"}/>
            <YAxis/>
            <CartesianGrid strokeDasharray="3 3"/>
            <Tooltip/>
            <Area type='monotone' dataKey='impressions' stroke='#25337a' fill='#839dd7' />
            <Area type='monotone' dataKey='clicks' stroke='#25337a' fill='#25337a' />
          </AreaChart>
        </ResponsiveContainer>
      )
    }
  }

  render() {
    return (
      <div>
        <Toolbar>
        <ToolbarGroup firstChild={true}>
          <DropDownMenu value={this.state.value} onChange={this.handleChange}>
            {this.props.ads.map((ad) => (
              <MenuItem key={ad._id} value={ad._id} secondaryText={ad.headline} />
            ))}
          </DropDownMenu>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarSeparator />
          <RaisedButton label="Download CSV" secondary={true} onTouchTap={this.handleDownload}/>
        </ToolbarGroup>
      </Toolbar>
      {this.renderChart()}
      </div>
    )
  }
}

export default createContainer(() => {
  Meteor.subscribe('ads')
  Meteor.subscribe('events')
  Meteor.subscribe('analytics')
  return {
    ads: Ads.find({}).fetch(),
    events: Events.find({}).fetch(),
    analytics: Analytics.find({}).fetch()
  }
}, AnalyticsChart)
