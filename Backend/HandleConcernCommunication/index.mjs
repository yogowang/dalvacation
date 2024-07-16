import { DynamoDBClient, UpdateItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});

export const handler = async (event) => {
  try{
    const { message_id, user_type, message } = JSON.parse(event.body);
    
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
    
    let chatArray = JSON.parse(item.chat.S);
    if (user_type === "property_agent") {
      const lastElement = chatArray[chatArray.length - 1];
      lastElement.property_agent = message;
    } else if (user_type === "customer") {
      chatArray.push({ customer: message });
    }

    const updateItemParams = {
      TableName: "Messages",
      Key: {
        message_id: { S: message_id }
      },
      UpdateExpression: "SET chat = :chat",
      ExpressionAttributeValues: {
        ":chat": { S: JSON.stringify(chatArray) }
      }
    };

    await client.send(new UpdateItemCommand(updateItemParams));
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Message added successfully" })
    };
  }
  catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" })
    };
  }
};
