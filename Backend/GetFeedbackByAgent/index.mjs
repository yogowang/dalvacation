import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
const lambdaClient = new LambdaClient({});

export const handler = async (event) => {
    const { agent_email } = event;
    const roomsTableName = process.env.RoomsDalVacationDynamoTableName;
    const feedbackTableName = process.env.FeedbackDalVacationDynamoTableName;
    const gcpSqlDumpLambdaName = process.env.AddLookerStudioDataToGcpSqlLambdaName;

    if (!agent_email) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing agentEmail query parameter' }),
        };
    }

    try {
        const feedbackData = await getFeedbackForAgent(agent_email, roomsTableName, feedbackTableName);
        console.log('feedbackData:', JSON.stringify(feedbackData));

        // Prepare the payload for the generalized Lambda function
        const payload = {
            tableName: 'feedbacks', // Change to the desired table name
            data: feedbackData
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
        console.error('Error fetching feedback data:', error);

        const response = {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error fetching feedback data',
            }),
        };

        return response;
    }
};

// Function to get feedback for a specific agentEmail without using GSI
const getFeedbackForAgent = async (agentEmail, roomsTableName, feedbackTableName) => {
    // Step 1: Scan the rooms table to get all room_ids for the given agentEmail
    const roomParams = {
        TableName: roomsTableName,
        FilterExpression: 'agent_email = :agentEmail',
        ExpressionAttributeValues: {
            ':agentEmail': agentEmail,
        },
        ProjectionExpression: 'room_id',
    };

    const roomData = await ddbDocClient.send(new ScanCommand(roomParams));
    const roomIds = roomData.Items.map(item => item.room_id);

    if (roomIds.length === 0) {
        return []; // No rooms found for the given agentEmail
    }

    // Step 2: Scan the feedback table using room_ids
    // Since DynamoDB does not support IN for ScanCommand, use a FilterExpression to match room_ids
    // Build the FilterExpression dynamically
    const filterExpression = roomIds.map((_, index) => `room_id = :roomId${index}`).join(' OR ');
    const expressionAttributeValues = roomIds.reduce((acc, roomId, index) => {
        acc[`:roomId${index}`] = roomId;
        return acc;
    }, {});

    const feedbackParams = {
        TableName: feedbackTableName,
        FilterExpression: filterExpression,
        ExpressionAttributeValues: expressionAttributeValues,
    };

    const feedbackData = await ddbDocClient.send(new ScanCommand(feedbackParams));
    return feedbackData.Items;
};