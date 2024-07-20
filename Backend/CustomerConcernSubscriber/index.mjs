import { DynamoDBClient, ScanCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import crypto from 'crypto';

const client = new DynamoDBClient({});

export const handler = async (event) => {
  try{
    const req = JSON.parse(event.body);
    const pubsubMessage = JSON.parse(Buffer.from(req.message.data, 'base64').toString('utf-8'));
    const {booking_reference_code, customer_email} = pubsubMessage;
    
    const params = {
      TableName: "UserDalVacation",
      FilterExpression: "user_type = :userType",
      ExpressionAttributeValues: {
        ":userType": { S: "property_agent" }
      }
    };
  
    const data = await client.send(new ScanCommand(params));
      
    if (data.Items.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "No property agents found" })
      };
    }
      
    const randomItem = data.Items[Math.floor(Math.random() * data.Items.length)];
    
    const property_agent_email = randomItem.email.S;

    const message_id = crypto.randomUUID();

    const messageItem = {
      TableName: "Messages",
      Item: {
        message_id: { S: message_id },
        customer_email: { S: customer_email },
        property_agent_email: { S: property_agent_email },
        booking_reference_code: {S: booking_reference_code}
      }
    };

    await client.send(new PutItemCommand(messageItem));

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
