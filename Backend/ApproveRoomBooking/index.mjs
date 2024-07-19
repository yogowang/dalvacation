import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

const BOOKINGS_TABLE = 'CustomerBookings';

export const handler = async (event) => {
  try {
    const { Records } = event;

    for (const record of Records) {
      const { booking_reference_code } = JSON.parse(record.body);

      const updateParams = {
        TableName: BOOKINGS_TABLE,
        Key: { booking_reference_code },
        UpdateExpression: "set is_approved = :approved",
        ExpressionAttributeValues: {
          ":approved": true
        },
        ReturnValues: "UPDATED_NEW"
      };

      const result = await dynamodb.send(new UpdateCommand(updateParams));

      console.log(`Booking approved successfully: ${JSON.stringify(result.Attributes)}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'All bookings processed successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to process bookings', error: error.message }),
    };
  }
};
