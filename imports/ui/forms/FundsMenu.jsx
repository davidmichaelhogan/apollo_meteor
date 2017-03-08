import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import Slider from 'material-ui/Slider'
import Checkbox from 'material-ui/Checkbox'
import { Tabs, Tab } from 'material-ui/Tabs'

import { first } from 'lodash'

import { Advertisers } from '../../api/advertisers.js'

const ctr = (clicks, impressions) => clicks / impressions
const impressions = (money) => money / 8 * 1000
const commaify = (number) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

const style = {
  margin: 20,
  padding: 10,
  input: {
    width: "22.5%",
    margin: "0 20px"
  },
  inputFull: {
    width: "80%",
    margin: "0 20px"
  }
}

class FundsMenu extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      slider: 5000.00
    }
  }

  returnCardOnFile = () => {
    if (this.props.advertiser) {
      return (
        <Tab label="Pay with Current Account" value={0}>
          <div className="payment-tab">
            <p>Account ID: <strong>{Meteor.user()._id}</strong><br />Email: <strong>{Meteor.user().emails[0].address}</strong></p>
          </div>
        </Tab>
      )
    }
  }

  handleSlider = (event, value) => {
    this.setState({slider: value})
    this.props.balanceUpdate(value)
  }

  render() {
    return (
      <div>
        <div className="sub-header">
          Impressions: {commaify(impressions(this.state.slider))}<br />
          Cost: ${commaify(this.state.slider.toFixed(2))}
        </div>
        <Slider
          min={100.00}
          max={10000.00}
          step={100}
          defaultValue={5000.00}
          value={this.state.slider}
          onChange={this.handleSlider}
        />
        <Tabs onChange={(value) => {this.props.paymentOption(value)}}>
        <Tab label="Pay with New Card" value={1}>
          <div className="payment-tab">
            <h2>Pay with new card</h2>
            <div className="sub-header">Payment Information</div>
            <TextField style={style.inputFull} hintText="John Doe" floatingLabelText="Full Name" onChange={(nada, value) => this.props.updateName(value)}/><br />
            <TextField style={style.inputFull} hintText="0001000200030004" floatingLabelText="Card Number" onChange={(nada, value) => this.props.updateCard(value)}/><br />
            <TextField style={style.input} hintText="01" floatingLabelText="Expiration Month" onChange={(nada, value) => this.props.updateExpMonth(value)}/>
            <TextField style={style.input} hintText="2017" floatingLabelText="Expiration Year" onChange={(nada, value) => this.props.updateExpYear(value)}/>
            <TextField style={style.input} hintText="001" floatingLabelText="Security Code" onChange={(nada, value) => this.props.updateCvc(value)}/><br />
          </div>
        </Tab>
        {this.returnCardOnFile()}
      </Tabs>
      </div>
    )
  }
}

export default createContainer(() => {
  Meteor.subscribe('advertisers')
  return {
    advertiser: first(Advertisers.find({}).fetch())
  }
}, FundsMenu)
