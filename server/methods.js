import { Meteor } from 'meteor/meteor'
import { first } from 'lodash'

import { Ads } from '../imports/api/ads.js'
import { Advertisers } from '../imports/api/advertisers.js'
import { Analytics } from '../imports/api/analytics.js'

const stripeKey = Meteor.settings.stripe.s_key
const Stripe = StripeAPI(stripeKey)

import { HTTP } from 'meteor/http'
import fs from 'fs'


Meteor.methods({
  deleteAd(ad) {
    Ads.remove({ _id: ad })
    // Remove ad lambda
  },
  'addAd'({ headline, subline, url, logo, advertiser, category, start, end, timeDiff, nextServed, balance }) {

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

    let apiAdUnit = {
      "headline": headline,
      "subline": subline,
      "url": url,
      "logo": logo,
      "advertiser": advertiser,
      "category": category,
      "start": start.getTime(), // change to EPOCH for Dynamo DB
      "end": end.getTime(),
      "clicks": 0,
      "impressions": 0,
      "balance": balance,
      "timeDiff": timeDiff,
      "nextServed": nextServed,
      "runAd": true
    }

    HTTP.post('https://20e2r2bap7.execute-api.us-east-1.amazonaws.com/1', {data: apiAdUnit}, (err) => console.log(err))

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
  },
  'chargeNewCard'({ stripeToken, balance, currentUser, name, forAccount}) {

    Stripe.customers.create({
      email: currentUser.emails[0].address,
      source: stripeToken,
    }).then(Meteor.bindEnvironment(function(customer) {
      // YOUR CODE: Save the customer ID and other info in a database for later.
      if (Advertisers.find({ _id: currentUser._id }).count() == 0 ) {
        if (forAccount) {
          Advertisers.insert({ _id: currentUser._id, name: name, balance: balance, stripeId: customer.id})
        } else {
          Advertisers.insert({ _id: currentUser._id, name: name, balance: 0, stripeId: customer.id})
        }
      } else {
        Advertisers.update({ _id: currentUser._id},
          {
            $set: { name: name, stripeId: customer.id }
          }
        )
      }
      return Stripe.charges.create({
        amount: balance * 100,
        currency: "usd",
        customer: customer.id,
        description: "Apollo Mobile Ads Campaign"
      })
    })).then(function(err, charge) {
      // Use and save the charge info.
      return charge
    })
  },
  'chargeCurrentCard'({ balance, currentUser }) {
    let advertiser = first(Advertisers.find({ _id: currentUser._id }).fetch())

    Stripe.charges.create({
      amount: balance * 100,
      currency: "usd",
      customer: advertiser.stripeId
    })
  },
  'updateAdvertiserBalance'({ balance, currentUser }) {
    console.log(balance + currentUser._id)
    Advertisers.update({ _id: currentUser._id },
      {
          $set: { balance: balance }
      }
    )
  },
  'sendEmail'({ email, name, phone, website }) {
    const body = {
      "email_address": email,
      "status": "subscribed",
      "merge_fields": {
        "NAME": name,
        "PHONE": phone,
        "WEBSITE": website
      }
    }
    HTTP.post('https://us15.api.mailchimp.com/3.0/lists/f8159e45b4/members', {data: body, auth: 'apollodev:36c3e397a2938129b9e771a7d832287e-us15'}, (err) => console.log(err))
  }
})
