import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const snsClient = new SNSClient({ region: 'us-east-1' });

const snsTopicArn = process.env.DalVacationHomeSnsTopicArn;

export const handler = async (event, context) => {
  console.log("Received Event:", JSON.stringify(event, null, 2));
  console.log("Received Context:", JSON.stringify(context, null, 2));
  let responseBody = "";
  let statusCode = 0;

  try {
    const { email, message, subject } = event;

    // Default subject if not provided
    const snsSubject = subject || "Notification from DALVacationHome";

    // Send the message exactly as received
    const snsParams = {
      TopicArn: snsTopicArn,
      Message: message,
      Subject: snsSubject,
      MessageAttributes: {
        'email': {
          'DataType': 'String',
          'StringValue': email
        }
      }
    };
    await snsClient.send(new PublishCommand(snsParams));

    responseBody = "Message sent successfully";
    statusCode = 200;
  } catch (error) {
    console.error("Error:", error);
    responseBody = `Failed to send message: ${error.message}`;
    statusCode = 500;
  }

  const response = {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(responseBody)
  };

  return response;
};
