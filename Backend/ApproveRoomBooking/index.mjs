import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);
const snsNotificationLambdaName = process.env.LambdaSNSNotificationName;
const lambdaClient = new LambdaClient({ region: 'us-east-1' });

const BOOKINGS_TABLE = 'CustomerBookings';

export const handler = async (event) => {
  try {
    const { Records } = event;
    console.log(Records)

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


      // accessing booking details and sending email
      const getParams = {
        TableName: BOOKINGS_TABLE,
        Key: {
          booking_reference_code: booking_reference_code
        }
      };

      const data = await dynamodb.send(new GetCommand(getParams));

      const emailSubject = "Room Booking Successfull";
      const emailMessage = `Dear user, \nI am pleased to inform you that your room booking has been successfully confirmed.Here are the details of your booking: \n\nBooking Details: \n• Booking Reference Code:${data.Item.booking_reference_code} \n• Start Data: ${data.Item.start_date} \n• End Date: ${data.Item.end_date} \n• Total Days: ${data.Item.total_days} \n• Total Amaount: ${data.Item.total_amount} \nIf you have any questions or need further assistance, please feel free to contact us. \nThank you for choosing our services. \n\nBest regards, \nDalVacationHome Team\n`;

      // Construct parameters for invoking Notification Lambda function
      const notificationParams = {
        FunctionName: snsNotificationLambdaName,
        InvocationType: 'Event', // Asynchronous invocation
        Payload: JSON.stringify({ email: data.Item.customer_email, message: emailMessage, subject: emailSubject })
      };
      // Invoke Success Login Notification
      await lambdaClient.send(new InvokeCommand(notificationParams));

      console.log(`Booking approved successfully: ${JSON.stringify(result.Attributes)}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'All bookings processed successfully' }),
    };
  }
  catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to process bookings', error: error.message }),
    };
  }
};
