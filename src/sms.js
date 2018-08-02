// Load the AWS SDK for Node.js
require('dotenv').config({ silent: true });

const AWS = require('aws-sdk');

const { AWS_KEY, AWS_SECRET } = process.env;

// Set region
AWS.config.update({
  accessKeyId: AWS_KEY,
  secretAccessKey: AWS_SECRET,
  region: 'ap-southeast-2'
});

export const sendSms = params => {
  // Create SMS Attribute parameters
  const _attrs = {
    attributes: {
      DefaultSMSType: 'Transactional' /* highest reliability */
    }
  };

  const sns = new AWS.SNS();

  return sns.publish(params, function(err, data) {
    if (err) console.error(err, err.stack);
    console.log('@@ SMS SENT');
  });
};
