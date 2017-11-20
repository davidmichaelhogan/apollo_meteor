const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

//Hash Generator
const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const ID_LENGTH = 10;

function generatehash() {
  var rtn = '';
  for (var i = 0; i < ID_LENGTH; i++) {
    rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
  }
  return rtn;
}

//Variable

const date = new Date().getTime();
const balance = 0.008;
let publisher = '';
let publisherId = '';
let category = '';
let adUnit = {};
let advertiser = '';
let adId = '';
let timeDiff = 0;

function rand(min,max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

exports.handler = function index(e, ctx, callback) {

    const pubId = e.pub

    const publisherQuery = {
        TableName : "publishers",
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: {
            ':id': pubId
        }
    };

    const adQuery = {
        TableName : "ads",
        ProjectionExpression: "#start, #end, balance, nextServed, runAd, category, headline, subline, #url, logo, advertiser, id, timeDiff",
        FilterExpression: "#start <= :date AND #end >= :date AND balance >= :bal AND nextServed <= :date AND runAd = :true AND category = :cat",
        ExpressionAttributeNames:{
            "#start": "start",
            "#end": "end",
            "#url": "url"
        },
        ExpressionAttributeValues: {
            ":date": date,
            ":bal": balance,
            ":true": true,
            ":cat": category
        }
    };

    let addEvent = {
        TableName: 'events',
        Item:{
            "id": generatehash(), //Should be randomly generated UUID
            "impression": 1,
            "click": 0,
            "publisher": pubId,
            "advertiser": advertiser,
            "adId": adId,
            "date": date
        }
    };

    let updateAd = {
        TableName: 'ads',
        Key: { 'id' : adId },
        UpdateExpression: 'SET impressions = impressions + :one',
        // ExpressionAttributeNames: {'#i' : 'impressions'},
        ExpressionAttributeValues: {
            ':one' : 1
        }
    }

    console.log(pubId)

    docClient.query(publisherQuery, function(err, data){
        if (err) {console.log(err);}
        else {

            publisher = data.Items[0];
            category = publisher.category;
            publisherId = publisher.id
            console.log('pub: ' + publisherId + '. Category: ' + category);

            docClient.scan(adQuery, function(err, data){
                if (err) {console.log(err);}
                else {
                    adUnit = data.Items[rand(0, data.Items.length - 1)]; //random ad from returned array - will take too long with many ads!
                    if (adUnit) {
                        //insert new event
                        advertiser = adUnit.advertiser
                        adId = adUnit.id
                        timeDiff = adUnit.timeDiff
                        console.log(adId)
                        docClient.put(addEvent, function(err, data) {
                            if (err) console.log('error: ' + err);
                            else console.log('event saved: ' + JSON.stringify(data));
                        })
                        docClient.update(updateAd, function(err, data) {
                            if (err) console.log('error: ' + err);
                            else console.log('ad updated.: ' + JSON.stringify(data));
                        })
                        callback(err, adUnit)
                    }
                }
            });
        }
    });
}
