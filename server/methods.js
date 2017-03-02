import { Meteor } from 'meteor/meteor'
import { Ads } from '../imports/api/ads.js'

Meteor.methods({
  deleteAd(ad) {
    Ads.remove({ _id: ad })
  },
  'addAd'( {headline, subline, url, logo, advertiser, category, start, end, balance} ) {
    new SimpleSchema({
      headline: { type: String, max: 50 },
      subline: { type: String, max: 150},
      url: { type: String, max: 250 },
      logo: { type: String, max: 250 },
      advertiser: { type: String },
      category: { type: String },
      start: { type: Date },
      end: { type: Date },
      balance: { type: Number }
    }).validate({ headline, subline, url, logo, advertiser, category, start, end, balance })

    Ads.insert({
      headline: headline,
      subline: subline,
      url: url,
      logo: logo,
      advertiser: advertiser,
      category: category,
      start: start,
      end: end,
      clicks: 0,
      impressions: 0,
      balance: balance
    })
  }
})
