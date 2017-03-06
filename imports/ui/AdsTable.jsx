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

import { Ads } from '../api/ads.js'

import FundsMenu from './FundsMenu'

const cpc =  (clicks, impressions) => {
  let calc = .008 / (1000 * (clicks / impressions * 100))
  if ((!calc) || (calc == 'Infinity')) {
    return 0.00
    console.log(calc + ' no')
  } else {
    console.log(calc)
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
      balance: null
    }
  }

  timesUpdate = (balance, start, end) => {
    let impressions = balance / .008
    let amount = (end.getTime() - start.getTime()) / impressions
    return amount
  }

  handlePaymentSubmit = () => {
    this.setState({open: false})
    this.setState({hasClicked: false})
    //Payment method
    Meteor.call('updateBalance', {
      ad_id: this.state.ad_id
    }, (err, res) => {
      if (err) {
        alert(err);
      } else {
        console.log('Payment Sent')
      }
    })
    console.log('Payment Submited')
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
      onTouchTap={this.handlePaymentSubmit}
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

  balanceUpdate (balance) {
    this.setState({ balance: balance })
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
      timeDiff: this.timesUpdate(this.state.balance, this.state.start, this.state.end),
      nextServed: (new Date().getTime() + this.timesUpdate(this.state.balance, this.state.start, this.state.end))
    }, (err, res) => {
      if (err) {
        alert(err);
      } else {
        console.log('Ad Set')
      }
    })
    this.setState({ hasClicked: false })
  }

  deleteAd(ad_id) {
    Meteor.call('deleteAd', ad_id)
    console.log('Delete this ad: ' + ad_id)
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
                  <TableRowColumn>${ad.balance.toFixed(2)}</TableRowColumn>
                  <TableRowColumn>
                    <div className="admenu">
                      <IconMenu
                        iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                        targetOrigin={{horizontal: 'right', vertical: 'top'}}
                      >
                        <MenuItem primaryText="Edit Settings"
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
                            balance: ad.balance
                          })}
                        />
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
            <div className="sub-header">Remaining Balance: ${commaify(this.state.balance.toFixed(2))} - {commaify(impressions(this.state.balance).toFixed(0))} impressions</div>
            <div className="sub-buttons">
              <FlatButton label="Save Settings" primary={true} onTouchTap={this.handleEditSubmit}/>
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
        <Dialog
          title="Add Funds to Campaign"
          actions={this.actions}
          modal={true}
          open={this.state.open}
          autoScrollBodyContent={true}
        >
        <FundsMenu balanceUpdate={(balance) => this.balanceUpdate(balance)}/>
        </Dialog>
      </div>
    )
  }
}

export default createContainer(() => {
  Meteor.subscribe('ads')
  return {
    ads: Ads.find({}).fetch()
  }
}, AdsTable)
