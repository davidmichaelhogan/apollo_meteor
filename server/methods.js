import { Meteor } from 'meteor/meteor'
import Stripe from 'stripe'
import { first } from 'lodash'

import { Ads } from '../imports/api/ads.js'
import { Advertisers } from '../imports/api/advertisers.js'

const stripeKey = Meteor.settings.stripe.s_key

Meteor.methods({
  deleteAd(ad) {
    Ads.remove({ _id: ad })
  },
  'chargeNewCard'({ stripeToken, balance, currentUser, name}) {
    var Stripe = StripeAPI(stripeKey);

    Stripe.customers.create({
      email: currentUser.emails[0].address,
      source: stripeToken,
    }).then(Meteor.bindEnvironment(function(customer) {
      // YOUR CODE: Save the customer ID and other info in a database for later.
      if (!Advertisers.find({ _id: currentUser._id })) {
        Advertisers.insert({ _id: currentUser._id, name: name, stripeId: customer.id}).limit(1)
      } else {
        Advertisers.update({ _id: currentUser._id}, {name: name, stripeId: customer.id})
      }
      return Stripe.charges.create({
        amount: balance * 100,
        currency: "usd",
        customer: customer.id,
      })
    })).then(function(err, charge) {
      console.log(err, charge)
      // Use and save the charge info.
    })
  },
  'chargeCurrentCard'({ balance, currentUser}) {
    let advertiser = first(Advertisers.find({ _id: currentUser._id }).fetch())
    console.log(advertiser.stripeId)
    var Stripe = StripeAPI(stripeKey);
    Stripe.charges.create({
      amount: balance * 100,
      currency: "usd",
      customer: advertiser.stripeId
    })
  },
  'addAd'({ headline, subline, url, logo, advertiser, category, start, end, timeDiff, nextServed, balance }) {
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
      nextServed: nextServed,
      runAd: true
    })
  },
  'updateAd'({ ad_id, headline, subline, url, logo, advertiser, category, start, end, impressions, clicks, timeDiff, nextServed }) {
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
          clicks: clicks,
          timeDiff: timeDiff,
          nextServed: nextServed
        }
    })
  },
  'updateAdBalance'({ balance, ad_id, timeDiff, nextServed }) {
      Ads.update(
      { _id: ad_id },
      {
        $set: { balance: balance, timeDiff: timeDiff, nextServed: nextServed }
    })
  },
  'pauseAd'({ ad_id }) {
    Ads.update(
      { _id: ad_id },
      {
        $set: { runAd: false }
      }
    )
  },
  'resumeAd'({ ad_id, timeDiff, nextServed }) {
    Ads.update(
      { _id: ad_id },
      {
        $set: { timeDiff: timeDiff, nextServed: nextServed, runAd: true }
      }
    )
  }
})
