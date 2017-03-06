import { Meteor } from 'meteor/meteor'
import { Ads } from '../imports/api/ads.js'

//Write standalone SimpleSchema to validate all ad objects
const balance = 1000
const balanceUpdate = true

Meteor.methods({
  deleteAd(ad) {
    Ads.remove({ _id: ad })
  },
  'addAd'({ headline, subline, url, logo, advertiser, category, start, end, timeDiff, nextServed }) {
    new SimpleSchema({
      headline: { type: String, max: 50 },
      subline: { type: String, max: 150},
      url: { type: String, max: 250 },
      logo: { type: String, max: 250 },
      advertiser: { type: String },
      category: { type: String },
      start: { type: Date },
      end: { type: Date }
    }).validate({ headline, subline, url, logo, advertiser, category, start, end })

    if (balanceUpdate) {
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
        balance: balance,
        timeDiff: timeDiff,
        nextServed: nextServed
      })
    } else {
      // Give user payment notification error!
    }
  },
  'updateAd'({ ad_id, headline, subline, url, logo, advertiser, category, start, end, impressions, clicks }) {
    new SimpleSchema({
      ad_id: { type: String },
      headline: { type: String, max: 50 },
      subline: { type: String, max: 150},
      url: { type: String, max: 250 },
      logo: { type: String, max: 250 },
      advertiser: { type: String },
      category: { type: String },
      start: { type: Date },
      end: { type: Date },
      impressions: { type: Number },
      clicks: { type: Number }
    }).validate({ ad_id, headline, subline, url, logo, advertiser, category, start, end, impressions, clicks })

    Ads.update(
      { _id: ad_id },
      {
        $set: {
          headline: headline,
          subline: subline,
          url: url,
          logo: logo,
          advertiser: advertiser,
          category: category,
          start: start,
          end: end,
          impressions: impressions,
          clicks: clicks
        }
    })
  },
  'updateBalance'({ ad_id }) {
    new SimpleSchema({
      ad_id: { type: String },
      balance: { type: Number }
    }).validate({ ad_id, balance })

    if (balanceUpdate) {
      Ads.update(
      { _id: ad_id },
      {
        $set: { balance: balance }
      })
    }
  }
})
