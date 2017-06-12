import { Meteor } from 'meteor/meteor'
import { WebApp } from 'meteor/webapp'
import { Mongo } from 'meteor/mongo'
import { first } from 'lodash'

import { Ads } from '../imports/api/ads.js'
import { Categories } from '../imports/api/categories.js'
import { Events } from '../imports/api/events.js'
import { Advertisers } from '../imports/api/advertisers.js'
import { Analytics } from '../imports/api/analytics.js'

const dateString = (new Date).toDateString()

Meteor.startup(() => {
  Meteor.publish('ads', function() {
    return Ads.find({ advertiser: this.userId })
  })
  Meteor.publish('advertisers', function() {
    return Advertisers.find({ _id: this.userId })
  })
  Meteor.publish('categories', function() {
    return Categories.find({})
  })
  Meteor.publish('events', function() {
    return Events.find({ advertiser: this.userId })
  })
  Meteor.publish('clicks', function() {
    return Events.find({ click: 1})
  })
  Meteor.publish('analytics', function() {
    return Analytics.find({})
  })

})

//Ad Api
WebApp.connectHandlers.use('/ad', function(req, res, next) {
  const date = new Date()
  const publisher = req.query.publisher
  const category = req.query.category ? Categories.findOne({
    name: req.query.category
  }) : null

  console.log(category)

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
      },
      nextServed: {
        $lte: date.getTime()
      },
      runAd: true
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
      date: new Date()
    })
    // Minus 0.008 from the current ads balance
    Ads.update(Ad, { $inc: { balance: -0.008, impressions: 1, nextServed: Ad.timeDiff}})

    //Update analytics data
    if (Analytics.find({ _id: Ad._id }).count() == 0 ) {
      Analytics.insert({
        _id: Ad._id,
        data: [
          {
            date: dateString,
            impressions: 1,
            clicks: 0
          }
        ]
      })
    } else  if (Analytics.find({ "data.date": dateString }).count() == 0) {
      Analytics.update({ _id: Ad._id },
        {
        $push: { data: { $each: [{ date: dateString, impressions: 1, clicks: 0 }]}}
      })
    } else {
    Analytics.update({ _id: Ad._id, "data.date": dateString} , { $inc: { "data.$.impressions": 1 }})
    }
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
    date: (new Date)
  })

  Ads.update(Ad, { $inc: {clicks: 1}})

  if (Analytics.find({ _id: Ad._id }).count() == 0 ) {
    Analytics.insert({
      _id: Ad._id,
      data: [
        {
          date: dateString,
          impressions: 0,
          clicks: 1
          }
      ]
    })
  } else  if (Analytics.find({ "data.date": dateString }).count() == 0) {
    Analytics.update({ _id: Ad._id },
      {
      $push: { data: { $each: [{ date: dateString, impressions: 0, clicks: 1 }]}}
    })
  } else {
    Analytics.update({ _id: Ad._id, "data.date": dateString} , { $inc: { "data.$.clicks": 1 }})
  }

  //redirect user to url
  res.writeHead(307, { 'Location': Ad.url })
  res.end()
})
