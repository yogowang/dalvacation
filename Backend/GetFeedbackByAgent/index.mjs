import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
const lambdaClient = new LambdaClient({});

const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
};

export const handler = async (event) => {
    console.log('Received event:', JSON.stringify(event));

    const { agentEmail } = event;
    console.log('Agent email:', agentEmail);

    const roomsTableName = "Rooms";
    const feedbackTableName = "FeedbackDalVacation";
    const gcpSqlDumpLambdaName = "hawa";

    if (!agentEmail) {
        console.log('Missing agentEmail query parameter');
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing agentEmail query parameter' }),
        };
    }

    try {
        const feedbackData = await getFeedbackForAgent(agentEmail, roomsTableName, feedbackTableName);
        console.log('Raw feedback data:', JSON.stringify(feedbackData));

        // Convert timestamps to formatted strings
        const modifiedFeedbackData = feedbackData.map(item => ({
            ...item,
            timestamp: formatTimestamp(item.timestamp),
        }));
        console.log('Modified feedback data:', JSON.stringify(modifiedFeedbackData));

        // Prepare the payload for the generalized Lambda function
        const payload = {
            tableName: 'feedbacks',
            data: modifiedFeedbackData,
        };
        console.log('Payload for the generalized Lambda function:', JSON.stringify(payload));

        // Invoke the generalized Lambda function
        const invokeParams = {
            FunctionName: gcpSqlDumpLambdaName,
            Payload: JSON.stringify(payload),
        };

        const invokeResponse = await lambdaClient.send(new InvokeCommand(invokeParams));
        console.log('Invoke response:', JSON.stringify(invokeResponse));

        const responsePayload = JSON.parse(new TextDecoder('utf-8').decode(invokeResponse.Payload));
        console.log('Response payload from the generalized Lambda function:', JSON.stringify(responsePayload));

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
    console.log('Getting feedback for agent email:', agentEmail);

    // Step 1: Scan the rooms table to get all room_ids for the given agentEmail
    const roomParams = {
        TableName: roomsTableName,
        IndexName: 'agent_email_index',
        FilterExpression: 'agent_email = :agentEmail',
        ExpressionAttributeValues: {
            ':agentEmail': agentEmail,
        },
        ProjectionExpression: 'room_id',
    };

    const roomData = await ddbDocClient.send(new ScanCommand(roomParams));
    console.log('Room data:', JSON.stringify(roomData));

    const roomIds = roomData.Items.map(item => item.room_id);
    console.log('Room IDs:', JSON.stringify(roomIds));

    if (roomIds.length === 0) {
        console.log('No rooms found for the given agent email');
        return []; // No rooms found for the given agentEmail
    }

    // Step 2: Scan the feedback table using room_ids
    // Since DynamoDB does not support IN for ScanCommand, use a FilterExpression to match room_ids
    // Build the FilterExpression dynamically
    const filterExpression = roomIds.map((_, index) => `room_id = :roomId${index}`).join(' OR ');
    const expressionAttributeValues = roomIds.reduce((acc, roomId, index) => {
        acc[`:roomId${index}`] = Number(roomId);
        return acc;
    }, {});

    console.log('Feedback table filter expression:', filterExpression);
    console.log('Feedback table expression attribute values:', JSON.stringify(expressionAttributeValues));

    const feedbackParams = {
        TableName: feedbackTableName,
        FilterExpression: filterExpression,
        ExpressionAttributeValues: expressionAttributeValues,
    };

    const feedbackData = await ddbDocClient.send(new ScanCommand(feedbackParams));
    console.log('Feedback data:', JSON.stringify(feedbackData));
    
    return feedbackData.Items;
};
