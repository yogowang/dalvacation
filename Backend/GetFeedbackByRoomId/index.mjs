//https://stackoverflow.com/questions/64053683/aws-dynamodb-query-with-nodejs
//https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-example-query-scan.html
//https://medium.com/@abir71.hosen/aws-dynamodb-query-vs-scan-306522b0f259
//https://stackoverflow.com/questions/33847477/querying-a-global-secondary-index-in-dynamodb-local
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

const tableName = process.env.FeedbackDalVacationDynamoTableName;
const GSIName=process.env.GSIName;

export const handler = async (event) => {
  console.log(event)
  const { room_id } = event;

  try {
    const params = {
      TableName: tableName,
      FilterExpression: "room_id = :room_id",
      ExpressionAttributeValues: {
        ":room_id": room_id
      }
    };

    const data = await dynamodb.send(new ScanCommand(params));

    if (!data.Items) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'No feedback on this room yet' }),
      };
    }

    return {
      statusCode: 200,
      body: data.Items,
    };
  }
  catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to get feedback', error: error.message }),
    };
  }
};