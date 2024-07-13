import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

const ROOMS_TABLE = 'Rooms';

export const handler = async (event) => {
  const { room_id, room_number, room_type, price, features } = JSON.parse(event.body);

  try {
    const getParams = {
      TableName: ROOMS_TABLE,
      Key: { room_id }
    };
    const existingRoom = await dynamodb.send(new GetCommand(getParams));

    if (!existingRoom.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Room not found' }),
      };
    }

    const updateParams = {
      TableName: ROOMS_TABLE,
      Key: { room_id },
      UpdateExpression: "SET room_number = :room_number, room_type = :room_type, price = :price, features = :features",
      ExpressionAttributeValues: {
        ":room_number": room_number,
        ":room_type": room_type,
        ":price": price,
        ":features": features
      },
      ReturnValues: "ALL_NEW"
    };

    const updatedRoom = await dynamodb.send(new UpdateCommand(updateParams));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Room updated successfully', updated_room: updatedRoom.Attributes }),
    };
  }
  catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to update room', error: error.message }),
    };
  }
};
