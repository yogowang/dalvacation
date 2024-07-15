import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

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

    const data = await dynamodb.send(new GetCommand(params));

    if (!data.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Room not found' }),
      };
    }

    return {
      statusCode: 200,
      body: data.Item,
    };
  }
  catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to get room details', error: error.message }),
    };
  }
};
