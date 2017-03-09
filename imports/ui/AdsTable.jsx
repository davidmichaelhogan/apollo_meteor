import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import Toggle from 'material-ui/Toggle'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import RaisedButton from 'material-ui/RaisedButton'
import Divider from 'material-ui/Divider'
import Paper from 'material-ui/Paper'
import DatePicker from 'material-ui/DatePicker'
import Dialog from 'material-ui/Dialog'
import IconDelete from 'material-ui/svg-icons/action/delete'
import IconSettings from 'material-ui/svg-icons/action/settings'
import IconPause from 'material-ui/svg-icons/av/pause'
import IconPlayArrow from 'material-ui/svg-icons/av/play-arrow'
import { first } from 'lodash'

import { Ads } from '../api/ads.js'
import { Advertisers } from '../api/advertisers.js'

import FundsMenu from './forms/FundsMenu'

const pauseIcon = <IconPause />
const runIcon = <IconPlayArrow />
const settingsIcon = <IconSettings />
const trashIcon = <IconDelete />

const cpc =  (clicks, impressions) => {
  let calc = 800 / (1000 * (clicks / impressions * 100))
  if ((!calc) || (calc == 'Infinity')) {
    return 0.00
  } else {
    return calc
  }
}

const ctr = (clicks, impressions) =>  (clicks / impressions * 100) ? (clicks / impressions * 100) : 0
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
    super(props)

    this.state = {
      selectable: false,
      showCheckboxes: false,
      hasClicked: false,
      open: false,
      tab: 0,
      dialogTitle: 'Add Funds to Campaign',
      name: null,
      ccNum: null,
      cvc: null,
      expMo: null,
      expYr: null,
      paymentOption: 0,
      ad_id: null,
      advertiser: null,
      category: null,
      headline: null,
      subline: null,
      logo: null,
      url: null,
      start: null,
      end: null,
      impressions: null,
      clicks: null,
      currentBalance: null,
      balance: 5000
    }
  }

  pauseButtonState (adState, text) {
    if (text && adState) {
      return 'Pause Ad'
    } else if (text && !adState) {
      return 'Run Ad'
    } else if (!text && adState) {
      return pauseIcon
    } else {
      return runIcon
    }
  }

  timesUpdate = (balance, start, end) => {
    let impressions = balance / .008
    let amount = (end.getTime() - start.getTime()) / impressions
    return amount
  }

  balanceUpdate (balance) {
    this.setState({ balance: balance })
  }

  paymentOption (tab) {
    this.setState({ paymentOption: tab })
  }

  updateName (name) {
    this.setState({ name: name })
  }

  updateCard (card) {
    this.setState({ ccNum: card })
  }

  updateExpMonth (month) {
    this.setState({ expMo: month })
  }

  updateExpYear (year) {
    this.setState({ expYr: year })
  }

  updateCvc (cvc) {
    this.setState({ cvc: cvc })
  }

  updateAdBalance = (balance) => {
    let newBalance = balance + this.state.currentBalance
    let newTime = new Date()
    if (this.state.start >= newTime) {
      newtime = this.state.start
    }
    this.setState({open: false})
    this.setState({hasClicked: false})
    //Update current Ad balance
    Meteor.call('updateAdBalance', {
      balance: newBalance, ad_id: this.state.ad_id,
      timeDiff: this.timesUpdate(newBalance, newTime, this.state.end),
      nextServed: (new Date().getTime() + this.timesUpdate(newBalance, newTime, this.state.end))
    })
  }

  pauseAd = (adState, ad_id, adBalance, start, end) => {
    let newTime = new Date()
    if (start >= newTime) {
      newtime = start
    }
    //if running, pause ad
    if (adState) {
      Meteor.call('pauseAd', { ad_id: ad_id })
    } else {
    // Run Ad, adjust timeDiff
      Meteor.call('resumeAd', {
        ad_id: ad_id,
        timeDiff: this.timesUpdate(adBalance, newTime, end),
        nextServed: (new Date().getTime() + this.timesUpdate(adBalance, newTime, end))
      })
    }
  }

  handleNewPaymentSubmit = () => {
    let balance = this.state.balance
    let name = this.state.name
    Stripe.card.createToken({
    	number: this.state.ccNum,
    	cvc: this.state.cvc,
    	exp_month: this.state.expMo,
    	exp_year: this.state.expYr
    }, (status, response) => {
      //Make finish button active or go to adstable or whatever
      if (status !== 200) {
        this.setState({ dialogTitle: response.error.message })
      } else {
      	let stripeToken = response.id
      	Meteor.call('chargeNewCard', { stripeToken: stripeToken, balance: balance, currentUser: Meteor.user(), name: name })
        //Create new ad unit once card is charged
        this.updateAdBalance(balance)
      }
    })
  }

  handleCurrentPaymentSubmit = () => {
    let balance = this.state.balance
    let balanceDiff = this.props.advertisers.balance - this.state.balance
    if (balanceDiff <= 0) {
      balanceDiff = -balanceDiff
      Meteor.call('updateAdvertiserBalance', { balance: 0, currentUser: Meteor.user() })
      Meteor.call('chargeCurrentCard', { balance: balanceDiff, currentUser: Meteor.user()})
    } else {
      Meteor.call('updateAdvertiserBalance', { balance: balanceDiff, currentUser: Meteor.user() })
    }
    this.updateAdBalance(balance)
  }

  handleCancel = () => {
    this.setState({open: false})
  }

  actions = [
    <FlatButton
      label="Cancel"
      primary={true}
      onTouchTap={this.handleCancel}
    />,
    <FlatButton
      label="Submit"
      primary={true}
      onTouchTap={() => {
        if (this.state.paymentOption == 1) {
          this.handleNewPaymentSubmit()
        } else if (this.state.paymentOption == 0){
          this.handleCurrentPaymentSubmit()
        }
      }}
    />,
  ]

  handleOpen = () => {
    this.setState({open: true})
  }

  handleEscape = (e) => {
    if (e.keyCode === 27) {
      this.setState({hasClicked: false})
    }
  }

  handleEditSubmit = () => {
    Meteor.call('updateAd', {
      ad_id: this.state.ad_id,
      headline: this.state.headline,
      subline: this.state.subline,
      url: this.state.url,
      logo: this.state.logo,
      advertiser: this.state.advertiser,
      category: this.state.category,
      start: this.state.start,
      end: this.state.end,
      impressions: this.state.impressions,
      clicks: this.state.clicks,
      timeDiff: this.timesUpdate(this.state.currentBalance, this.state.start, this.state.end),
      nextServed: (new Date().getTime() + this.timesUpdate(this.state.currentBalance, this.state.start, this.state.end))
    }, (err, res) => {
      if (err) {
        alert(err);
      } else {
        console.log('Ad Set')
      }
    })
    this.setState({ hasClicked: false })
  }

  deleteAd(ad_id, balance) {
    let balanceDiff = balance + this.props.advertisers.balance
    Meteor.call('deleteAd', ad_id)
    Meteor.call('updateAdvertiserBalance', { balance: balanceDiff, currentUser: Meteor.user()})
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
              <TableHeaderColumn>CPC</TableHeaderColumn>
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
                  <TableRowColumn>${cpc(ad.clicks, ad.impressions).toFixed(2)}</TableRowColumn>
                  <TableRowColumn>${commaify(ad.balance.toFixed(2))}</TableRowColumn>
                  <TableRowColumn>
                    <div className="admenu">
                      <IconMenu
                        iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                        targetOrigin={{horizontal: 'right', vertical: 'top'}}
                      >
                        <MenuItem primaryText={this.pauseButtonState(ad.runAd, true)} leftIcon={this.pauseButtonState(ad.runAd, false)} onTouchTap={(event) => this.pauseAd(ad.runAd, ad._id, ad.balance, ad.start, ad.end)}/>
                        <MenuItem primaryText="Edit Settings" leftIcon={settingsIcon}
                          onTouchTap={() => this.setState({
                            hasClicked: true,
                            ad_id: ad._id,
                            advertiser: ad.advertiser,
                            category: ad.category,
                            headline:ad.headline,
                            subline: ad.subline,
                            logo: ad.logo,
                            url: ad.url,
                            start: ad.start,
                            end: ad.end,
                            impressions: ad.impressions,
                            clicks: ad.clicks,
                            currentBalance: ad.balance
                          })}
                        />
                        <MenuItem primaryText="Delete Ad" leftIcon={trashIcon} onTouchTap={(event) => this.deleteAd(ad._id, ad.balance)}/>
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
            <RaisedButton primary={true} label="Save Settings" primary={true} onTouchTap={this.handleEditSubmit}/>
            <RaisedButton label="Cancel" onTouchTap={() => this.setState({hasClicked: false})}/>
          </div>
          <div className="clear"></div>
          <div className="ad-editor">
          <div className="sample-ad-top">
          <div className="sample-ad-headline">{this.state.headline}</div>
          <div className="sample-ad-logo"><img src={this.state.logo} /></div>
          <div className="clear"></div>
          </div>
          <div className="sample-ad-bottom">
          {this.state.subline}
          </div>
            <div className="float">
              <TextField
                defaultValue={this.state.headline}
                floatingLabelText="Headline"
                onChange={(nada, value) => this.setState({headline: value})}
                onKeyDown={this.handleEscape}
              /><br />
              <TextField
                defaultValue={this.state.subline}
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
                defaultValue={this.state.url}
                floatingLabelText="Click-through URL"
                fullWidth={true}
                onChange={(nada, value) => this.setState({url: value})}
                onKeyDown={this.handleEscape}
              />
              <TextField
                defaultValue={this.state.logo}
                floatingLabelText="Logo Location URL"
                fullWidth={true}
                onChange={(nada, value) => this.setState({logo: value})}
                onKeyDown={this.handleEscape}
              />
            </div>
            <div className="sub-header">Remaining Balance: <strong>${commaify(this.state.currentBalance.toFixed(2))} - {commaify(impressions(this.state.currentBalance).toFixed(0))} impressions</strong></div>
            <div className="sub-buttons">
              <RaisedButton label="Add Funds" onTouchTap={this.handleOpen} />
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
        <Dialog
          title={this.state.dialogTitle}
          actions={this.actions}
          modal={true}
          open={this.state.open}
          autoScrollBodyContent={true}
        >
        <FundsMenu
          paymentOption={(option) => this.paymentOption(option)}
          balanceUpdate={(balance) => this.balanceUpdate(balance)}
          updateName={(name) => this.updateName(name)}
          updateCard={(card) => this.updateCard(card)}
          updateExpMonth={(month) => this.updateExpMonth(month)}
          updateExpYear={(year) => this.updateExpYear(year)}
          updateCvc={(cvc) => this.updateCvc(cvc)}
        />
        </Dialog>
      </div>
    )
  }
}

export default createContainer(() => {
  Meteor.subscribe('ads')
  Meteor.subscribe('advertisers')
  return {
    ads: Ads.find({}).fetch(),
    advertisers: first(Advertisers.find({}).fetch())
  }
}, AdsTable)
