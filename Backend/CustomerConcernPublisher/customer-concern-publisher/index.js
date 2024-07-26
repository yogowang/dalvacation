const functions = require('@google-cloud/functions-framework');
const { PubSub } = require('@google-cloud/pubsub');

const projectId = 'dalvacationhome-429614';
const topicId = 'customer-concern-topic';

const pubsub = new PubSub({ projectId });
const topic = pubsub.topic(topicId);

functions.http('customer_concern_publisher', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*'); // Adjust as needed
  res.set('Access-Control-Allow-Methods', 'POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  const { booking_reference_code, customer_email} = req.body;
  const messageData = {
    booking_reference_code,
    customer_email
  };

  const messageBuffer = Buffer.from(JSON.stringify(messageData));

  try {
    const messageId = await topic.publish(messageBuffer);
    res.status(200).send(messageId);
  } catch (error) {
    console.error(`Error publishing message: ${error.message}`);
    res.status(500).send('Error publishing message.');
  }
});
