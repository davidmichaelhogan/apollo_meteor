import { Meteor } from 'meteor/meteor'
import { WebApp } from 'meteor/webapp'
import { Mongo } from 'meteor/mongo'
import { ObjectId } from 'mongodb'
import { first } from 'lodash'

import { Ads } from '../imports/api/ads.js'
import { Categories } from '../imports/api/categories.js'

WebApp.connectHandlers.use('/ad', function(req, res, next) {
  const date = new Date()

  const category = req.query.category ? Categories.findOne({
    name: req.query.category
  }) : null

  const Ad = first(Ads.aggregate([{
    $match: {
      ...(category ? {
        category: ObjectId(category._id._str)
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
    // Minues 0.008 from the current ads balance
  }


  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(Ad))
})

Meteor.startup(() => {

})
