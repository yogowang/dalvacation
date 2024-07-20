import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { SQSClient, SendMessageCommand, GetQueueUrlCommand } from "@aws-sdk/client-sqs";

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);
const sqsClient = new SQSClient({});
const sqsQueueName = "room-booking-approval";

const BOOKINGS_TABLE = 'CustomerBookings';

export const handler = async (event) => {
  const { customer_email, room_id, start_date, end_date, total_days, total_amount } = event;

  const booking_reference_code = generateBookingReferenceCode();

  try {
    const bookingParams = {
      TableName: BOOKINGS_TABLE,
      Item: {
        booking_reference_code,
        customer_email,
        room_id,
        start_date,
        end_date,
        total_days,
        total_amount,
        is_approved: false
      }
    };

    await dynamodb.send(new PutCommand(bookingParams));

    const queueUrlResponse = await sqsClient.send(new GetQueueUrlCommand({ QueueName: sqsQueueName }));
    const sqsQueueUrl = queueUrlResponse.QueueUrl;

    const sqsParams = {
      QueueUrl: sqsQueueUrl,
      MessageBody: JSON.stringify({ booking_reference_code })
    };

    await sqsClient.send(new SendMessageCommand(sqsParams));

    return {
      statusCode: 200,
      body: { message: 'Booking added successfully', booking_reference_code },
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
