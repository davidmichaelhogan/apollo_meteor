const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' })

const dateString = (new Date).toDateString()

exports.handler = function index(e, ctx, callback) {
    const date = new Date()
    let publisher = null

    const publisherQuery = {
        TableName : "publishers",
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: {
            ':id': '594017eadf931d10bc421f1e'
        }
    }

    const adQuery = {
      TableName: "publishers",
      ProjectionExpression: "#yr, title, info.rating",
      FilterExpression: "#yr between :start_yr and :end_yr",
      ExpressionAttributeNames: {
          "#yr": "year",
      },
      ExpressionAttributeValues: {
           ":start_yr": 1950,
           ":end_yr": 1959
      }
  }

    docClient.query(publisherQuery, function(err, data){
        if (err) {console.log(err)}
        else {
            console.log(data.Items[0].category)
        }
    })
}
