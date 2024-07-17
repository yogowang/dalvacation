import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

const BOOKINGS_TABLE = 'CustomerBookings';

export const handler = async (event) => {
  const { customer_id, room_id, start_date, end_date, total_days, total_amount } = JSON.parse(event.body);
  
  const booking_reference_code = generateBookingReferenceCode();
  
  try {
    const bookingParams = {
      TableName: BOOKINGS_TABLE,
      Item: {
        booking_reference_code,
        customer_id,
        room_id,
        start_date,
        end_date,
        total_days,
        total_amount
      }
    };

    await dynamodb.send(new PutCommand(bookingParams));
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Booking added successfully', booking_reference_code }),
    };
  }
  catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to add booking', error: error.message }),
    };
  }
};

function generateBookingReferenceCode() {
  return 'BOOK-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}
