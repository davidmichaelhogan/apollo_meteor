import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

import { Ads } from '../api/ads.js'


class AdsTable extends Component {
  renderAds() {
    return this.props.ads.map((ad) => (
        <TableRow key={ad._id}>
          <TableRowColumn>{ad._id}</TableRowColumn>
          <TableRowColumn>{ad.headline}</TableRowColumn>
          <TableRowColumn>{ad.url}</TableRowColumn>
          <TableRowColumn>${ad.balance.toFixed(2)}</TableRowColumn>
      </TableRow>
    ));
  }
  render() {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderColumn>ID</TableHeaderColumn>
            <TableHeaderColumn>Headline</TableHeaderColumn>
            <TableHeaderColumn>Url</TableHeaderColumn>
            <TableHeaderColumn>Balance</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
        {this.renderAds()}
        </TableBody>
      </Table>
    )
  }
}

export default createContainer(() => {
  Meteor.subscribe('ads')
  return {
    ads: Ads.find({}).fetch(),
  };
}, AdsTable);
