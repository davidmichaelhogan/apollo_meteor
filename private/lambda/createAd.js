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

//Random function
function rand(min,max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

//Variables

const date = new Date().getTime();


exports.handler = function index(e, ctx, callback) {

    // let adUnit = {
    //     "id": generatehash(),
    //     "headline": "Example Headline",
    //     "subline": "Example Subline",
    //     "url": "URL",
    //     "logo": "URL",
    //     "advertiser": 0,
    //     "category": 0,
    //     "start": 0,
    //     "end": 0,
    //     "clicks": 0,
    //     "impressions": 0,
    //     "balance": 0,
    //     "timeDiff": 0,
    //     "nextServed": 0,
    //     "runAd": true
    // }


    adUnit = e.body
    adUnit.id = generatehash()

    console.log(adUnit)

        let addAd = {
        TableName: 'ads',
        Item: adUnit
    };

    docClient.put(addAd, function(err, data) {
        if (err) callback(err, err)
        else callback(err, adUnit)
    })
}
