import React from 'react'
import Drawer from 'material-ui/Drawer'
import AppBar from 'material-ui/AppBar'
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation'
import Paper from 'material-ui/Paper'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import IconPerson from 'material-ui/svg-icons/social/person'
import IconAccount from 'material-ui/svg-icons/action/account-balance'
import IconAdd from 'material-ui/svg-icons/content/add'
import IconToc from 'material-ui/svg-icons/action/toc'
import IconUp from 'material-ui/svg-icons/action/trending-up'
import IconTime from 'material-ui/svg-icons/device/access-time'

import Content from './Content'

const personIcon = <IconPerson />
const moneyIcon = <IconAccount />
const addIcon = <IconAdd />
const currentIcon = <IconToc />
const upIcon = <IconUp />
const timeIcon = <IconTime />

export default class Nav extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      open: false,
      selectedIndex: 0,
      setPage: 0
    }
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

  select = (index) => this.setState({selectedIndex: index})

  render() {
    return (
      <div>
      <div>
        <AppBar
          title="Apollo Advertiser DSP"
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
          <p />
          <h2>Analytics</h2>
          <MenuItem onTouchTap={this.handleMenuThree} leftIcon={upIcon}>Real Time Event Data</MenuItem>
          <MenuItem onTouchTap={this.handleMenuFour} leftIcon={timeIcon}>Past Campaign Reports</MenuItem>

        </Drawer>
      </div>
      <Content currentPage={this.state.setPage}/>
      <div className="bottom-nav">
        <Paper zDepth={1}>
          <BottomNavigation selectedIndex={this.state.selectedIndex}>
            <BottomNavigationItem
              label="Logout of Dashboard"
              icon={personIcon}
              onTouchTap={() => {this.props.changeLoginState(false); console.log('logged out')}}
            />
          </BottomNavigation>
        </Paper>
      </div>
      </div>
    )
  }
}
