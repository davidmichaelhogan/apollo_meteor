import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import Drawer from 'material-ui/Drawer'
import AppBar from 'material-ui/AppBar'
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import Paper from 'material-ui/Paper'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import IconPerson from 'material-ui/svg-icons/social/person'
import IconAccount from 'material-ui/svg-icons/action/account-balance'
import IconAdd from 'material-ui/svg-icons/content/add'
import IconToc from 'material-ui/svg-icons/action/toc'
import IconUp from 'material-ui/svg-icons/action/trending-up'
import IconTime from 'material-ui/svg-icons/device/access-time'
import IconArrow from 'material-ui/svg-icons/navigation/subdirectory-arrow-left'
import { first } from 'lodash'

import Content from './Content'
import FundsMenu from './forms/FundsMenu'
import { Advertisers } from '../api/advertisers'

const personIcon = <IconPerson />
const moneyIcon = <IconAccount />
const addIcon = <IconAdd />
const currentIcon = <IconToc />
const upIcon = <IconUp />
const timeIcon = <IconTime />
const outIcon = <IconArrow />

const commaify = (number) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

class Nav extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      open: false,
      selectedIndex: 0,
      dialogTitle: 'Add Funds to Account',
      paymentOption: 0,
      setPage: 1,
      showFunds: false,
      balance: 5000

    }
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

  handleBalance = () => {
    if (this.props.advertiser) {
      return '$' + commaify(this.props.advertiser.balance.toFixed(2))
    } else {
      return '$0.00'
    }
  }

  handleAddFunds = () => {
    this.setState({ showFunds: true })
  }

  handleToggle = () => this.setState({open: !this.state.open})

  handleMenuOne = () => {
    this.setState({open: false})
    this.setState({setPage: 1})
  }

  handleMenuTwo = () => {
    this.setState({open: false})
    this.setState({setPage: 0})
  }

  handleMenuThree = () => {
    this.setState({open: false})
    this.setState({setPage: 2})
  }

  handleMenuFour = () => {
    this.setState({open: false})
    this.setState({setPage: 0})
  }

  handleNewPaymentSubmit = () => {
    let balance = this.props.advertiser ? (this.state.balance + this.props.advertiser.balance) : this.state.balance
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
      	Meteor.call('chargeNewCard', { stripeToken: stripeToken, balance: balance, currentUser: Meteor.user(), name: name, forAccount: true})
        //Update account balance
        this.setState({ showFunds: false})
      }
    })
  }

  handleCurrentPaymentSubmit = () => {
    let balance = this.state.balance + this.props.advertiser.balance
    Meteor.call('chargeCurrentCard', { balance: balance, currentUser: Meteor.user()})
    Meteor.call('updateAdvertiserBalance', { balance: balance, currentUser: Meteor.user() })
    this.setState({ showFunds: false})
  }

  handleCancel = () => {
    this.setState({showFunds: false})
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

  select = (index) => this.setState({selectedIndex: index})

  render() {
    return (
      <div>
      <div>
        <AppBar
          title="Apollo Ad Server"
          onLeftIconButtonTouchTap={this.handleToggle}
        />
        <Drawer
          docked={false}
          containerClassName="side-bar"
          width={300}
          open={this.state.open}
          onRequestChange={(open) => this.setState({open})}
        >
          <h2>Campaign Settings</h2>
          <MenuItem onTouchTap={this.handleMenuOne} leftIcon={addIcon}>New Campaign Setup</MenuItem>
          <MenuItem onTouchTap={this.handleMenuTwo} leftIcon={currentIcon}>Current Campaigns</MenuItem>

        </Drawer>
      </div>
      <Content currentPage={this.state.setPage}/>
      <div className="bottom-nav">
        <Paper zDepth={1}>
          <BottomNavigation selectedIndex={1}>
            <BottomNavigationItem
              label="Logout of Dashboard"
              icon={outIcon}
              onTouchTap={() => {this.props.changeLoginState(false)}}
            />
            <BottomNavigationItem
              label={this.handleBalance()}
              icon={moneyIcon}
              onTouchTap={() => this.handleAddFunds()}
            />
          </BottomNavigation>
        </Paper>
      </div>
        <Dialog
          title={this.state.dialogTitle}
          actions={this.actions}
          modal={true}
          open={this.state.showFunds}
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
  Meteor.subscribe('advertisers')
  return {
    advertiser: first(Advertisers.find({}).fetch())
  }
}, Nav)
