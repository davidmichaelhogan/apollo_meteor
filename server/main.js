import { Meteor } from 'meteor/meteor'
import { WebApp } from 'meteor/webapp'
import { Mongo } from 'meteor/mongo'
import { first } from 'lodash'

import { Ads } from '../imports/api/ads.js'
import { Categories } from '../imports/api/categories.js'
import { Events } from '../imports/api/events.js'
import { Advertisers } from '../imports/api/advertisers.js'
import { Analytics } from '../imports/api/analytics.js'
import { Publishers } from '../imports/api/publishers.js'
import { Remnant } from '../imports/api/remnant.js'

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
  Meteor.publish('publishers', function() {
    return Publishers.find({})
  })

})

const rand = (min,max) => {
  return Math.floor(Math.random()*(max-min+1)+min)
}

//Ad Api
WebApp.connectHandlers.use('/ad', function(req, res, next) {
  const date = new Date()
  let remnant = false,
  publisher = {},
  category = 0

  if (req.query.remnant) {
    console.log(req.query.pubname)
    remnant = true
    publisher = Publishers.findOne({ name: req.query.pubname })
  } else {
    publisher = Publishers.findOne({ _id : req.query.publisher })
    category = (publisher.category !== 0) ? (publisher.category) : null
  }
  let Ad = ''

  //Direct placements will have a publisher attribute in replace of cateory
  if (remnant) {
    Ad = first(Ads.aggregate([{
      $match: {
        remnant: true
      }
    }, {
      $sample : {
        size : 1
      }
    }]))
  } else {
    Ad = first(Ads.aggregate([{
      $match: {
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
        runAd: true,
        $or: [
          { category: category }, { publisher: publisher._id }
        ]
      }
    }, {
      $sample : {
        size : 1
      }
    }]))
  }

  if (Ad) {
    // Create new impressions event

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
  let remnant = false,
  publisher = {},
  category = 0

  if (req.query.remnant) {
    console.log(req.query.id)
    publisher = Publishers.findOne({ name: req.query.pubname })
  } else {
    publisher = Publishers.findOne({ _id : req.query.publisher })
  }
  const ad_id = req.query.id
  const Ad = Ads.findOne({
    _id: ad_id
  })
  // Create new click event

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

//Remnant Event handler
WebApp.connectHandlers.use('/remnant', function(req, res, next) {
  const links = Remnant.findOne({ name: 'links' })
  const link = links.links[rand(0, links.links.length - 1)]
  let click = false,
      show  = false

  const impressions = Remnant.findOne({ name: 'impressions' })
  console.log(impressions.impressions)
  Remnant.update({ name: 'impressions' }, { $inc: {impressions: 1}} )

  if (impressions.impressions > 10 ) {
    click = true
    Remnant.update({ name: 'impressions' }, { $set : { impressions: 0 }})
  } else if (impressions.impressions % 2 == 0) {
    show = true
  }

  const data = {'link' : link, 'click' : click, 'show' : show, 'impressions' : impressions.impressions }

  //if one needs a clicks

  res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'})
  res.end(JSON.stringify(data))
})

WebApp.connectHandlers.use('/links', function(req, res, next) {
  const links = Remnant.findOne({ name: 'links' })

  const data = links.links

  res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'})
  res.end(JSON.stringify(data))
})
