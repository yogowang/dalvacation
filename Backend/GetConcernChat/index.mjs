import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});

export const handler = async (event) => {
  try {
    const { message_id } = event.queryStringParameters;

    if (!message_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "message_id query parameter is required" })
      };
    }

    const getItemParams = {
      TableName: "Messages",
      Key: {
        message_id: { S: message_id }
      }
    };

    const getItemResult = await client.send(new GetItemCommand(getItemParams));
    const item = getItemResult.Item;

    if (!item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Message not found" })
      };
    }

    const chat = JSON.parse(item.chat.S);

    return {
      statusCode: 200,
      body: JSON.stringify({ chat })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" })
    };
  }
};
