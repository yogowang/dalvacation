import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

const tableName = process.env.FeedbackDalVacationDynamoTableName;

export const handler = async (event) => {
  try {
    const scanParams = {
      TableName: tableName,
    };

    const data = await dynamodb.send(new ScanCommand(scanParams));

    console.log(data)

    return {
      statusCode: 200,
      body: data.Items,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to fetch feedbacks', error: error.message }),
    };
  }
};