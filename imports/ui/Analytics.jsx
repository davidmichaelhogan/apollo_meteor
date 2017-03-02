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

//Fake data for use with graph
const data = {
  id_3AaJ8Hg5EGHBdPGvq: [
    {date: new Date(1488221780396), clicks: 150, impressions: 567},
    {date: new Date(1488221744396), clicks: 100, impressions: 267},
    {date: new Date(1498321740396), clicks: 40, impressions: 567},
    {date: new Date(1488231740396), clicks: 120, impressions: 467},
    {date: new Date(1488223740396), clicks: 180, impressions: 357},
    {date: new Date(1488221740396), clicks: 200, impressions: 537},
    {date: new Date(1488241740396), clicks: 10, impressions: 574},
    {date: new Date(1488221743396), clicks: 140, impressions: 527},
    {date: new Date(1482221740396), clicks: 100, impressions: 467},
    {date: new Date(1488221780396), clicks: 150, impressions: 567},
    {date: new Date(1488221744396), clicks: 100, impressions: 267},
    {date: new Date(1498321740396), clicks: 40, impressions: 567},
    {date: new Date(1488231740396), clicks: 120, impressions: 467},
    {date: new Date(1488223740396), clicks: 180, impressions: 357},
    {date: new Date(1488221740396), clicks: 200, impressions: 537},
    {date: new Date(1488241740396), clicks: 10, impressions: 574},
    {date: new Date(1488221743396), clicks: 140, impressions: 527},
    {date: new Date(1482221740396), clicks: 100, impressions: 467}
  ],
    id_LiPfAAf2oaWeXke8b: [
      {date: new Date(1488221780396), clicks: 150, impressions: 567},
      {date: new Date(1488221744396), clicks: 100, impressions: 267},
      {date: new Date(1498321740396), clicks: 40, impressions: 567},
      {date: new Date(1488231740396), clicks: 120, impressions: 467},
      {date: new Date(1488223740396), clicks: 180, impressions: 357},
      {date: new Date(1488221740396), clicks: 200, impressions: 537},
      {date: new Date(1488241740396), clicks: 10, impressions: 574},
      {date: new Date(1488221743396), clicks: 140, impressions: 527},
      {date: new Date(1482221740396), clicks: 100, impressions: 467},
      {date: new Date(1488221780396), clicks: 150, impressions: 567},
      {date: new Date(1488221744396), clicks: 100, impressions: 267},
      {date: new Date(1498321740396), clicks: 40, impressions: 567},
      {date: new Date(1488231740396), clicks: 120, impressions: 467},
      {date: new Date(1488223740396), clicks: 180, impressions: 357},
      {date: new Date(1488221740396), clicks: 200, impressions: 537},
      {date: new Date(1488241740396), clicks: 10, impressions: 574},
      {date: new Date(1488221743396), clicks: 140, impressions: 527},
      {date: new Date(1482221740396), clicks: 100, impressions: 467}
    ],
      id_QJkDPiWxNDzaZmHAM: [
        {date: new Date(1488221780396), clicks: 150, impressions: 567},
        {date: new Date(1488221744396), clicks: 100, impressions: 267},
        {date: new Date(1498321740396), clicks: 40, impressions: 567},
        {date: new Date(1488231740396), clicks: 120, impressions: 467},
        {date: new Date(1488223740396), clicks: 180, impressions: 357},
        {date: new Date(1488221740396), clicks: 200, impressions: 537},
        {date: new Date(1488241740396), clicks: 10, impressions: 574},
        {date: new Date(1488221743396), clicks: 140, impressions: 527},
        {date: new Date(1482221740396), clicks: 100, impressions: 467},
        {date: new Date(1488221780396), clicks: 150, impressions: 567},
        {date: new Date(1488221744396), clicks: 100, impressions: 267},
        {date: new Date(1498321740396), clicks: 40, impressions: 567},
        {date: new Date(1488231740396), clicks: 120, impressions: 467},
        {date: new Date(1488223740396), clicks: 180, impressions: 357},
        {date: new Date(1488221740396), clicks: 200, impressions: 537},
        {date: new Date(1488241740396), clicks: 10, impressions: 574},
        {date: new Date(1488221743396), clicks: 140, impressions: 527},
        {date: new Date(1482221740396), clicks: 100, impressions: 467}
      ]
}

class Analytics extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      //Set menu to first Ad
      value: this.props.ads[0]._id
    }
  }

  handleChange = (event, index, value) => this.setState({value})

  renderChart() {
    //Key corresponding with each ad and written in data object
    let key = 'id_' + this.state.value
    return (
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data[key]}>
          <XAxis dataKey={"clicks"}/>
          <YAxis/>
          <CartesianGrid strokeDasharray="3 3"/>
          <Tooltip/>
          <Area type='monotone' dataKey='impressions' stroke='#25337a' fill='#839dd7' />
          <Area type='monotone' dataKey='clicks' stroke='#25337a' fill='#25337a' />
        </AreaChart>
      </ResponsiveContainer>
    )
  }

  render() {
    return (
      <div>
        <Toolbar>
        <ToolbarGroup firstChild={true}>
        <div className="ana-header">Choose Ad Campaign:</div>
          <DropDownMenu value={this.state.value} onChange={this.handleChange}>
            {this.props.ads.map((ad) => (
              <MenuItem key={ad._id} value={ad._id} primaryText={ad.headline} />
            ))}
          </DropDownMenu>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarSeparator />
          <RaisedButton label="Download CSV" primary={true} />
          <IconMenu
            iconButtonElement={
              <IconButton touch={true}>
                <NavigationExpandMoreIcon />
              </IconButton>
            }
          >
            <MenuItem primaryText="Export to " />
            <MenuItem primaryText="More Info" />
          </IconMenu>
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
  return {
    ads: Ads.find({}).fetch(),
    events: Events.find({}).fetch()
  }
}, Analytics)
