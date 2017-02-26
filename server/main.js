import { Meteor } from 'meteor/meteor'
import { WebApp } from 'meteor/webapp'
import { Mongo } from 'meteor/mongo'
import { first } from 'lodash'

import { Ads } from '../imports/api/ads.js'
import { Categories } from '../imports/api/categories.js'
import { Events } from '../imports/api/events.js'

Meteor.startup(() => {
  Meteor.publish('ads', function() {
    return Ads.find({})
  })
})

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
      type: 'impression',
      publisher: publisher,
      ad_id: Ad._id,
      time: new Date
    })
    // Minus 0.008 from the current ads balance
    Ads.update(Ad, { $inc: { balance: -0.008, impressions: 1}})
  }

  res.writeHead(200, {'Content-Type': 'application/json'})
  res.end(JSON.stringify(Ad))
})

//Click event handler
WebApp.connectHandlers.use('/click', function(req, res, next) {
  const publisher = req.query.publisher
  const ad_id = req.query.id
  // Create new click event
  Events.insert({
    type: 'click',
    publisher: publisher,
    ad_id: ad_id,
    time: new Date
  })
  //redirect user to url
  const Ad = Ads.findOne({
    _id: ad_id
  })

  Ads.update(Ad, { $inc: {clicks: 1}})

  res.writeHead(307, { 'Location': Ad.url })
  res.end()
})
