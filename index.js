const aws = require('aws-sdk');

exports.handler = async function(event, context) {
  try{
    console.log("event: ", event);
    const { Records } = event;
    const body = JSON.parse(Records[0].body);
    console.log("Incoming message body from SQS :", body);

    const message = JSON.parse(body["Message"]);
    
    var ses = new aws.SES({region: "ap-southeast-1"});
    var params = {
      Destination: {
        ToAddresses: [message["email"]],
      },
      Message: {
        Body: {
          Text: { Data: `Dear Valued Customer, \n\n${message["message"]} at ${body["Timestamp"]}. \n\nIf you have any questions, please call our hotline. \n\nThank you for banking with us. \n\n Yours sincerely, \n\n Swift Bank` },
        },
        Subject: { Data: "Notifications@swiftbank.tech" },
      },
      Source: "xuanli743@gmail.com",
    };
    
    var result = await ses.sendEmail(params).promise();
    console.log(result);
    return {"statusCode": 200, "message": "success"};
  }
  catch(error) {
    console.error("Error in executing lambda: ", error);
    return {"statusCode": 500, "message": "Error while executing"};
  }
  
  // event.Records.forEach(record => {
  //   const { body } = record;
  //   console.log(body);
  // })
  // return {};
};