import { Meteor } from 'meteor/meteor'
import { WebApp } from 'meteor/webapp'
import { Mongo } from 'meteor/mongo'
import { first } from 'lodash'

import { Ads } from '../imports/api/ads.js'
import { Categories } from '../imports/api/categories.js'
import { Events } from '../imports/api/events.js'

Meteor.startup(() => {
  Meteor.publish('ads', function() {
    return Ads.find({advertiser: '58a885b681ff1e4611b3d172' })
  })
  Meteor.publish('events', function() {
    // return events based on login info!!!
    return Events.find({ advertiser: '58a885b681ff1e4611b3d172' })
  })
  Meteor.publish('clicks', function() {
    return Events.find({ click: 1})
  })
})

// // Access Control
// WebApp.rawConnectHandlers.use(function(req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin", "*")
//   return next();
// });

//Ad Api
WebApp.connectHandlers.use('/ad', function(req, res, next) {
  const date = new Date()
  const publisher = req.query.publisher
  const category = req.query.category ? Categories.findOne({
    name: req.query.category
  }) : null

  const Ad = first(Ads.aggregate([{
    $match: {
      ...(category ? {
        category: category._id
      } : null),
      start: {
        $lte: date
      },
      end: {
        $gte: date
      },
      balance: {
        $gte: 0.008
      }
    }
  }, {
    $sample : {
      size : 1
    }
  }]))

  if (Ad) {
    // Create new impressions event
    Events.insert({
      impression: 1,
      click: 0,
      publisher: publisher,
      advertiser: Ad.advertiser,
      ad_id: Ad._id,
      date: (new Date).toDateString()
    })
    // Minus 0.008 from the current ads balance
    Ads.update(Ad, { $inc: { balance: -0.008, impressions: 1}})
  }

  res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'})
  res.end(JSON.stringify(Ad))
})

//Click event handler
WebApp.connectHandlers.use('/click', function(req, res, next) {
  const publisher = req.query.publisher
  const ad_id = req.query.id
  const Ad = Ads.findOne({
    _id: ad_id
  })
  // Create new click event
  Events.insert({
    impressions: 0,
    click: 1,
    publisher: publisher,
    advertiser: Ad.advertiser,
    ad_id: ad_id,
    date: (new Date).toDateString()
  })

  Ads.update(Ad, { $inc: {clicks: 1}})

  //redirect user to url
  res.writeHead(307, { 'Location': Ad.url })
  res.end()
})
