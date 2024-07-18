import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

const tableName = process.env.FeedbackDalVacationDynamoTableName;

export const handler = async (event) => {
  console.log(event)
  const { feedback_id } = event;

  try {
    const params = {
      TableName: tableName,
      Key: {
        feedback_id: feedback_id
      }
    };

    await dynamodb.send(new DeleteCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Feedback deleted successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to delete Feedback', error: error.message }),
    };
  }
};