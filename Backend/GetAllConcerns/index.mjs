import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});

export const handler = async (event) => {
  try {
    const { email } = event;

    const params = {
      TableName: "Messages",
      FilterExpression: "customer_email = :email or property_agent_email = :email",
      ExpressionAttributeValues: {
        ":email": { S: email }
      }
    };

    const data = await client.send(new ScanCommand(params));

    if (data.Items.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "No concerns found for the provided email" })
      };
    }

    const concerns = data.Items.map(item => ({
      message_id: item.message_id.S,
      booking_reference_code: item.booking_reference_code.S,
      customer_email: item.customer_email.S,
      property_agent_email: item.property_agent_email.S
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ concerns })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" })
    };
  }
};
