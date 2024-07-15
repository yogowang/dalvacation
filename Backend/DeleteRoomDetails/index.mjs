import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

const ROOMS_TABLE = 'Rooms';

export const handler = async (event) => {
  console.log(event)
  const { room_id } = event;

  try {
    const params = {
      TableName: ROOMS_TABLE,
      Key: {
        room_id: room_id
      }
    };

    await dynamodb.send(new DeleteCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Room deleted successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to delete room', error: error.message }),
    };
  }
};
