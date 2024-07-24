import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
const lambdaClient = new LambdaClient({});

export const handler = async (event) => {
    const { agentEmail } = event;
    const roomsTableName = process.env.RoomsDalVacationDynamoTableName;
    const bookingsTableName = process.env.BookingsDalVacationDynamoTableName;
    const gcpSqlDumpLambdaName = process.env.AddLookerStudioDataToGcpSqlLambdaName;

    if (!agentEmail) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing agent_email query parameter' }),
        };
    }

    try {
        const bookingsData = await getBookingsForAgent(agentEmail, roomsTableName, bookingsTableName);
        console.log('bookingsData:', JSON.stringify(bookingsData));

        // Prepare the payload for the generalized Lambda function
        const payload = {
            tableName: 'bookings', // Change to the desired table name
            data: bookingsData
        };

        // Invoke the generalized Lambda function
        const invokeParams = {
            FunctionName: gcpSqlDumpLambdaName,
            Payload: JSON.stringify(payload),
        };

        const invokeResponse = await lambdaClient.send(new InvokeCommand(invokeParams));
        const responsePayload = JSON.parse(new TextDecoder('utf-8').decode(invokeResponse.Payload));

        if (invokeResponse.StatusCode === 200) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Data successfully written to GCP MySQL', response: responsePayload }),
            };
        } else {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Failed to write data to GCP MySQL', response: responsePayload }),
            };
        }
    } catch (error) {
        console.error('Error fetching bookings data:', error);

        const response = {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error fetching bookings data',
            }),
        };

        return response;
    }
};

// Function to get bookings for a specific agent_email by performing a join between rooms and bookings tables
const getBookingsForAgent = async (agentEmail, roomsTableName, bookingsTableName) => {
    // Step 1: Get all room_ids for the given agent_email
    const roomParams = {
        TableName: roomsTableName,
        IndexName: 'agent_email_index',
        KeyConditionExpression: 'agent_email = :agentEmail',
        ExpressionAttributeValues: {
            ':agentEmail': agentEmail,
        },
        ProjectionExpression: 'room_id',
    };

    const roomData = await ddbDocClient.send(new QueryCommand(roomParams));
    console.log('roomData:', JSON.stringify(roomData));
    const roomIds = roomData.Items.map(item => item.room_id);
    console.log('roomIds:', JSON.stringify(roomIds));

    if (roomIds.length === 0) {
        return []; // No rooms found for the given agent_email
    }

    // Step 2: Query the bookings table using room_ids
    // Since DynamoDB does not support IN for ScanCommand, use a FilterExpression to match room_ids
    // Build the FilterExpression dynamically
    const filterExpression = roomIds.map((_, index) => `room_id_index = :roomId${index}`).join(' OR ');
    const expressionAttributeValues = roomIds.reduce((acc, roomId, index) => {
        acc[`:roomId${index}`] = roomId;
        return acc;
    }, {});

    const bookingParams = {
        TableName: bookingsTableName,
        FilterExpression: filterExpression,
        ExpressionAttributeValues: expressionAttributeValues,
    };

    const bookingData = await ddbDocClient.send(new ScanCommand(bookingParams));
    return bookingData.Items;
};
