import React from 'react';
import { createContainer } from 'meteor/react-meteor-data'
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn}
  from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import DatePicker from 'material-ui/DatePicker';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Slider from 'material-ui/Slider';
import Checkbox from 'material-ui/Checkbox';
import {Tabs, Tab} from 'material-ui/Tabs';

import { Ads } from '../api/ads.js'

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

class AdsTable extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selectable: false,
      showCheckboxes: false,
      hasClicked: false,
      open: false,
      slider: 5000.00,
      tab: 0,
      _id: null,
      headline: null,
      subline: null,
      logo: null,
      url: null,
      start: null,
      end: null,
      balance: null
    };
  }

  handleOpen = () => {
    this.setState({open: true})
  }

  handlePaymentSubmit = () => {
    this.setState({open: false})
    this.setState({hasClicked: false})
    //Put payment callback here
    console.log('Payment Submited')
  }

  handleCancel = () => {
    this.setState({open: false})
  }

  handleEscape = (e) => {
    if (e.keyCode === 27) {
      this.setState({hasClicked: false})
    }
  }

  handleTab = (value) => {
    this.setState({
      tab: value,
    })
  }

  handleSlider = (event, value) => {
    this.setState({slider: value});
  }

  deleteAd(ad_id) {
    //Run delete Meteor Method here
    console.log('Delete this ad: ' + ad_id)
  }

  loadFundsMenu() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleCancel}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onTouchTap={this.handlePaymentSubmit}
      />,
    ];
    return (
      <Dialog
        title="Add Funds to Campaign"
        actions={actions}
        modal={true}
        open={this.state.open}
        autoScrollBodyContent={true}
      >
        <div className="sub-header">
          Impressions: {commaify(impressions(this.state.slider))} (per 30 days)<br />
          Cost: ${commaify(this.state.slider.toFixed(2))}
        </div>
        <Slider
          min={100.00}
          max={10000.00}
          step={1}
          defaultValue={500.00}
          value={this.state.slider}
          onChange={this.handleSlider}
        />
        <Tabs
        value={this.state.tab}
        onChange={this.handleTab}
        >
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
            <div className="sub-header">Click <strong>Submit</strong> to process payment.</div>
          </div>
        </Tab>
      </Tabs>
      </Dialog>
    )
  }

  loadMenu() {
    if (!this.state.hasClicked) {
      return (
        <div>
        <div className="title">Your Current Ad Campaigns</div>
        <Table selectable={this.state.selectable}>
          <TableHeader displaySelectAll={this.state.showCheckboxes} adjustForCheckbox={this.state.showCheckboxes}>
            <TableRow>
              <TableHeaderColumn>Headline</TableHeaderColumn>
              <TableHeaderColumn>Subline</TableHeaderColumn>
              <TableHeaderColumn>URL</TableHeaderColumn>
              <TableHeaderColumn>Impressions</TableHeaderColumn>
              <TableHeaderColumn>Clicks</TableHeaderColumn>
              <TableHeaderColumn>CTR</TableHeaderColumn>
              <TableHeaderColumn>Balance</TableHeaderColumn>
              <TableHeaderColumn>Ad Settings</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={this.state.showCheckboxes} adjustForCheckbox={this.state.showCheckboxes}>
            {this.props.ads.map((ad) => (
                <TableRow key={ad._id}>
                  <TableRowColumn>{ad.headline}</TableRowColumn>
                  <TableRowColumn>{ad.subline}</TableRowColumn>
                  <TableRowColumn>{ad.url.replace('http://', '').replace('https://', '')}</TableRowColumn>
                  <TableRowColumn>{ad.impressions}</TableRowColumn>
                  <TableRowColumn>{ad.clicks}</TableRowColumn>
                  <TableRowColumn>%{ctr(ad.clicks, ad.impressions).toFixed(2)}</TableRowColumn>
                  <TableRowColumn>${ad.balance.toFixed(2)}</TableRowColumn>
                  <TableRowColumn>
                    <div className="admenu">
                      <IconMenu
                        iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                        targetOrigin={{horizontal: 'right', vertical: 'top'}}
                      >
                        <MenuItem primaryText="Edit Settings" onTouchTap={() => this.setState({hasClicked: true, _id: ad._id, headline: ad.headline, subline: ad.subline, logo: ad.logo, url: ad.url, start: ad.start, end: ad.end, balance: ad.balance})}/>
                        <MenuItem primaryText="Delete Ad" onTouchTap={(event) => this.deleteAd(ad._id)}/>
                      </IconMenu>
                    </div>
                  </TableRowColumn>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
        </div>
      )
    } else {
      return (
        <div>
          <div className="left-title">Ad Editor
            <div className="sub-title">Click any field to edit. Leave blank to keep current setting.</div>
          </div>
          <div className="back-button">
            <RaisedButton label="Cancel" onTouchTap={() => this.setState({hasClicked: false})}/>
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
            <div className="float">
              <div className="date"><DatePicker onChange={(x, date) => this.setState({start: date})} hintText={this.state.start.toString().split(this.state.start.getFullYear())[0]} /></div>
              <div className="date"><DatePicker onChange={(x, date) => this.setState({end: date})} hintText={this.state.end.toString().split(this.state.end.getFullYear())[0]} /></div>
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
            <div className="sub-header">Remaining Balance: ${commaify(this.state.balance.toFixed(2))} - {commaify(impressions(this.state.balance).toFixed(0))} impressions</div>
            <div className="sub-buttons">
              <FlatButton label="Save Settings" primary={true} onTouchTap={() => console.log(
                'Headline: ' + this.state.headline + '\n' +
                'Subline: ' + this.state.subline + '\n' +
                'URL: ' + this.state.url + '\n' +
                'Start Date: ' + this.state.start + '\n' +
                'End Date: ' + this.state.end

              )}/>
            </div>
            <div className="sub-buttons">
              <FlatButton label="Add Funds" onTouchTap={this.handleOpen} />
            </div>
          </div>
        </div>
      )
    }
  }

  render() {
    return (
      <div>
        {this.loadMenu()}
        {this.loadFundsMenu()}
      </div>
    )
  }
}

export default createContainer(() => {
  Meteor.subscribe('ads')
  return {
    ads: Ads.find({}).fetch()
  }
}, AdsTable);
