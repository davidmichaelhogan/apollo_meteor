import React from 'react'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import Slider from 'material-ui/Slider'
import Checkbox from 'material-ui/Checkbox'
import { Tabs, Tab } from 'material-ui/Tabs'

const ctr = (clicks, impressions) => clicks / impressions
const impressions = (money) => money / 8 * 1000
const commaify = (number) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

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

class FundsMenu extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      slider: 5000.00
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
          Impressions: {commaify(impressions(this.state.slider))} (per 30 days)<br />
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
        <Tabs>
        <Tab label="Pay with Current Information" value={0} >
          <div className="payment-tab">
            <p>Account ID: <strong>56789789</strong><br />Email: <strong>nothing@gmail.com</strong></p>
            <div className="sub-header">Click <strong>Submit</strong> to pay with your saved account information.</div>
          </div>
        </Tab>
        <Tab label="Pay with New Card" value={1}>
          <div className="payment-tab">
            <h2>Pay with new card</h2>
            <div className="sub-header">Contact Information</div>
            <TextField style={style.input} hintText="Steve" floatingLabelText="First Name"/><TextField style={style.input} hintText="Jobs" floatingLabelText="Last Name"/><br />
            <TextField style={style.input} hintText="1 Apple Tree Way, Suite 226" floatingLabelText="Address" /><TextField style={style.input} hintText="Los Angeles" floatingLabelText="City"/><br />
            <TextField style={style.input} hintText="CA" floatingLabelText="State"/><TextField style={style.input} hintText="01035" floatingLabelText="Zip"/>
            <div className="sub-header">Payment Information</div>
            <TextField style={style.inputFull} hintText="0001000200030004" floatingLabelText="Card Number"/><br />
            <TextField style={style.inputFull} hintText="Steven Jobs" floatingLabelText="Full Name"/><br />
            <TextField style={style.input} hintText="01/2017" floatingLabelText="Expiration Date" /><TextField style={style.input} hintText="001" floatingLabelText="Security Code"/>
          </div>
        </Tab>
      </Tabs>
      </div>
    )
  }
}

export default FundsMenu
