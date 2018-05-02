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
let category = '000';
let adUnit = {};
let adId = '';
let timeDiff = 0;

function rand(min,max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

exports.handler = function index(e, ctx, callback) {

    console.log(e)

    const pubId = '593f80d7df931d10bc421f11' //e.pub
    const adId = '593f8177df931d10bc421f12' //e.ad

    const adQuery = {
        TableName : "ads",
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: {
            ':id': adId
        }
    };

    let addEvent = {
        TableName: 'events',
        Item:{
            "id": generatehash(), //Should be randomly generated UUID
            "impression": 0,
            "click": 1,
            "publisher": pubId,
            "adId": adId,
            "date": date
        }
    };

    let updateAd = {
        TableName: 'ads',
        Key: { 'id' : adId },
        UpdateExpression: 'SET clicks = clicks + :one',
        ExpressionAttributeValues: {
            ':one' : 1
        }
    }

    console.log(pubId)

    docClient.query(adQuery, function(err, data){
        if (err) {console.log(err);}
        else {
            ad = data.Items[0];

            docClient.put(addEvent)
            docClient.update(updateAd)
            //callback(null, 'hello')
            // callback(null, {
            //     statusCode: 302,
            //     headers: {
            //       Location: ad.url,
            //     }
            // })
            callback(null, {"statusCode": 200, "body": "hi"})
        }
    });
}
