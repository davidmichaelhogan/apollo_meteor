import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Step, Stepper, StepLabel } from 'material-ui/Stepper'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import ExpandTransition from 'material-ui/internal/ExpandTransition'
import TextField from 'material-ui/TextField'
import Slider from 'material-ui/Slider'
import DatePicker from 'material-ui/DatePicker'
import { Tabs, Tab } from 'material-ui/Tabs'

const ctr = (clicks, impressions) => clicks / impressions
const impressions = (money) => money / 8 * 1000
const commaify = (number) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

import { Ads } from '../api/ads.js'

import FundsMenu from './FundsMenu'

const style = {
  margin: 20,
  padding: 10,
  input: {
    margin: "0 20px"
  },
  inputFull: {
    width: "80%",
    margin: "0 20px"
  }
}

class AdsStepper extends React.Component {

  state = {
    loading: false,
    finished: false,
    stepIndex: 0,
    open: false,
    advertiser: '58a885b681ff1e4611b3d172', // Setup state to change advertiser with login
    category: '58a886d597a4ce608ea459dd',  //Create option for category
    headline: 'Apollo Ad Server Example',
    subline: 'Your subline will appear here. Click in the fields below to make your ad.',
    logo: 'http://apolloads.io/img/form-logo.png',
    url: 'http://apollopods.com',
    start: new Date,
    end: new Date,
    balance: 5000
  }

  balanceUpdate (balance) {
    this.setState({ balance: balance })
  }

  dummyAsync = (cb) => {
    this.setState({loading: true}, () => {
      this.asyncTimer = setTimeout(cb, 500);
    })
  }

  handleNext = () => {
    const {stepIndex} = this.state
    if (!this.state.loading) {
      this.dummyAsync(() => this.setState({
        loading: false,
        stepIndex: stepIndex + 1,
        finished: stepIndex >= 2,
        runAddAd: stepIndex >= 2
      }))
    }
  }

  handlePrev = () => {
    const {stepIndex} = this.state
    if (!this.state.loading) {
      this.dummyAsync(() => this.setState({
        loading: false,
        stepIndex: stepIndex - 1,
      }))
    }
  }

  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return (
          <div>
            <div className="left-title">Campaign Dates</div>
            <div className="clear"></div>
              <div className="date">Start: <DatePicker onChange={(x, date) => this.setState({start: date})} hintText={this.state.start.toString().split(this.state.start.getFullYear())[0]} /></div>
              <div className="date">End: <DatePicker onChange={(x, date) => this.setState({end: date})} hintText={this.state.end.toString().split(this.state.end.getFullYear())[0]} /></div>
          </div>
        )
      case 1:
        return (
          <div>
            <div className="left-title">Ad Editor
            </div>
            <div className="clear"></div>
            <div className="ad-editor">
            <a href={this.state.url} target="new">
            <div className="sample-ad-top">
            <div className="sample-ad-headline">{this.state.headline}</div>
            <div className="sample-ad-logo"><img src={this.state.logo} /></div>
            <div className="clear"></div>
            </div>
            <div className="sample-ad-bottom">
            {this.state.subline}
            </div>
            </a>
              <div className="float">
                <TextField
                  hintText={this.state.headline}
                  floatingLabelText="Headline"
                  onChange={(nada, value) => this.setState({headline: value})}
                  onKeyDown={this.handleEscape}
                /><br />
                <TextField
                  hintText={this.state.subline}
                  floatingLabelText="Subline"
                  multiLine={true}
                  rows={2}
                  rowsMax={2}
                  style={{width: 370}}
                  onChange={(nada, value) => this.setState({subline: value})}
                  onKeyDown={this.handleEscape}
                />
              </div>
              <div className="three">
                <TextField
                  hintText={this.state.url}
                  floatingLabelText="Click-through URL"
                  fullWidth={true}
                  onChange={(nada, value) => this.setState({url: value})}
                  onKeyDown={this.handleEscape}
                />
                <TextField
                  hintText={this.state.logo}
                  floatingLabelText="Logo Location URL"
                  fullWidth={true}
                  onChange={(nada, value) => this.setState({logo: value})}
                  onKeyDown={this.handleEscape}
                />
              </div>
          </div>
          </div>
        )
      case 2:
            return (
                <FundsMenu balanceUpdate={(balance) => this.balanceUpdate(balance)}/>
            )
      default:
        return 'WTF YOU DOIN'
    }
  }

  renderContent() {
    const {finished, stepIndex, runAddAd} = this.state
    const contentStyle = {margin: '0 16px', overflow: 'hidden'}

    if (finished) {
      //Update ad to Server
      if (runAddAd) {
        Meteor.call('addAd', {
          headline: this.state.headline,
          subline: this.state.subline,
          url: this.state.url,
          logo: this.state.logo,
          advertiser: this.state.advertiser,
          category: this.state.category,
          start: this.state.start,
          end: this.state.end
        }, (err, res) => {
          if (err) {
            alert(err);
          } else {
            console.log('Ad Set')
            this.setState({ runAddAd: false })
          }
        })
      }


      //Process Payment

      return (
        <div style={contentStyle}>
          Your ad will begin running on the specified start date.<br />
          Thank you for choosing Apollo!
        </div>
      )
    }

    return (
      <div style={contentStyle}>
        <div>{this.getStepContent(stepIndex)}</div>
        <div style={{marginTop: 24, marginBottom: 12}}>
          <FlatButton
            label="Back"
            disabled={stepIndex === 0}
            onTouchTap={this.handlePrev}
            style={{marginRight: 12}}
          />
          <RaisedButton
            label={stepIndex === 2 ? 'Finish' : 'Next'}
            primary={true}
            onTouchTap={this.handleNext}
          />
        </div>
      </div>
    )
  }

  render() {
    const {loading, stepIndex} = this.state

    return (
      <div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
        <Stepper activeStep={stepIndex}>
          <Step>
            <StepLabel>Select campaign dates</StepLabel>
          </Step>
          <Step>
            <StepLabel>Create an ad</StepLabel>
          </Step>
          <Step>
            <StepLabel>Choose impressions</StepLabel>
          </Step>
        </Stepper>
        <ExpandTransition loading={loading} open={true}>
          {this.renderContent()}
        </ExpandTransition>
      </div>
    )
  }
}

export default createContainer(() => {
  Meteor.subscribe('ads')
  return {
    ads: Ads.find({}).fetch()
  }
}, AdsStepper)
