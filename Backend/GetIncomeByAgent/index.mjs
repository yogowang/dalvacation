//https://medium.com/@abir71.hosen/aws-dynamodb-query-vs-scan-306522b0f259
//https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-example-query-scan.html
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

const tableNameRooms = process.env.RoomsDynamoTableName;
const BOOKINGS_TABLE = 'CustomerBookings';
export const handler = async (event) => {
  try {
    const scanParams_room = {
      TableName: tableNameRooms,
      ProjectionExpression: 'room_id, agent_id'
    };
    const data_rooms = await dynamodb.send(new ScanCommand(scanParams_room));
    const scanParams_booking = {
        TableName: BOOKINGS_TABLE,
        ProjectionExpression: 'room_id, total_amount'
      };
    const data_booking = await dynamodb.send(new ScanCommand(scanParams_booking));
    const income_by_room = data_booking.Items.reduce(function(pv, cv) {
        if ( pv[cv.room_id] ) {
            pv[cv.room_id] += cv.total_amount;
        } else {
            pv[cv.room_id] = cv.total_amount;
        }
        return pv;
    }, {});
    const income_by_agent = data_rooms.Items.reduce(function(pv, cv) {
        if ( pv[cv.agent_id] ) {
            pv[cv.agent_id] += income_by_room[cv.room_id];
        } else {
            pv[cv.agent_id] = income_by_room[cv.room_id];
        }
        return pv;
    }, {});
    return {
      statusCode: 200,
      body: income_by_agent,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to fetch stats', error: error.message }),
    };
  }
};