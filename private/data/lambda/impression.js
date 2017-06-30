const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

const date = new Date().getTime();
const balance = 0.008;
let publisher = null;
let category = null;
let adUnit = null;
let advertiser = null;
let adId = null;

function rand(min,max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

exports.handler = function index(e, ctx, callback) {

    const publisherQuery = {
        TableName : "publishers",
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: {
            ':id': '594017eadf931d10bc421f1e' //Find publisher based on params
        }
    };

    const adQuery = {
        TableName : "ads",
        ProjectionExpression: "#start, #end, balance, nextServed, runAd, category, headline, subline, #url, logo",
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

    const addAd = {
        TableName: 'events',
        Item:{
            "id": "2AXu2mtAAHQFraCcm", //Should be randomly generated UUID
            "impression": 1,
            "click": 0,
            "publisher": publisher,
            "advertiser": advertiser,
            "adId": adId,
            "date": date
        }
    };

    docClient.query(publisherQuery, function(err, data){
        if (err) {console.log(err);}
        else {
            publisher = data.Items[0];
            category = publisher.category;
            console.log('pub: ' + publisher.id + '. Category: ' + category);

            docClient.scan(adQuery, function(err, data){
                if (err) {console.log(err);}
                else {
                    const adArr = data.Items;
                    adUnit = adArr[rand(0, adArr.length - 1)];
                    if (adUnit) {
                        console.log(adUnit.headline);
                        //insert new event
                        advertiser = adUnit.advertiser;
                        adId = adUnit.id;
                        console.log(adId)
                        docClient.put(addAd, function(err, data) {
                            if (err) {
                                console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                            } else {
                                console.log("Added item:", JSON.stringify(data, null, 2));
                            }
                        });

                        //update ad unit
                    }
                }
            });
        }
    });
}
