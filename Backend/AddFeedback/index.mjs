//https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-example-dynamodb-utilities.html
//https://codedamn.com/news/javascript/how-to-convert-timestamp-to-date-in-javascript
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import crypto from 'crypto';
const ddbClient = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(ddbClient);

export const handler = async (event) => {
  const { email, text } = event;
  const feedback_id=crypto.randomUUID();
  const timestamp=Date.now();
  const date= new Date(timestamp).toDateString();
  let responseBody = "";
  let statusCode = 0;
  const tableName = process.env.FeedbackDalVacationDynamoTableName;

  try {
      await dynamo.send(
      new PutCommand({
        TableName: tableName,
        Item: {
          feedback_id:feedback_id,
          timestamp:timestamp,
          email: email,
          text: text,
          date:date
        },
      })
    );
    responseBody='feedback submitted';
    statusCode=200;
  } catch (error) {
    responseBody = `submission failed: ${error.message}`;
    statusCode = 500;
  }

  const response = {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json"
    },
    body: responseBody
  };
  return response;
};