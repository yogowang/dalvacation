import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
const lambdaClient = new LambdaClient({});

export const handler = async (event) => {
    const { agentEmail } = event;
    const roomsTableName = process.env.RoomsDalVacationDynamoTableName;
    const usersTableName = process.env.UserDalVacationDynamoTableName;
    const gcpSqlDumpLambdaName = process.env.AddLookerStudioDataToGcpSqlLambdaName;

    if (!agentEmail) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing agent_email query parameter' }),
        };
    }

    try {
        const [roomsCount, usersCount, totalEarnings] = await Promise.all([
            getRoomsCount(agentEmail, roomsTableName),
            getCustomerUsersCount(usersTableName)
        ]);

        // Prepare the payload for the generalized Lambda function
        const payload = {
            tableName: 'metrics', // Change to the desired table name
            data: {
                totalRooms: roomsCount,
                totalUsers: usersCount
            }
        };
        console.log('payload:', JSON.stringify(payload));

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
        console.error('Error calculating data:', error);

        const response = {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error calculating data',
            }),
        };

        return response;
    }
};

// Function to get the count of rooms for a specific agent_email
const getRoomsCount = async (agentEmail, roomsTableName) => {
    const params = {
        TableName: roomsTableName,
        IndexName: 'agent_email_index', // Ensure this index exists
        KeyConditionExpression: 'agent_email = :agentEmail',
        ExpressionAttributeValues: {
            ':agentEmail': agentEmail,
        },
        Select: 'COUNT',
    };

    console.log(`getRoomsCount Params: ${JSON.stringify(params)}`);
    const data = await ddbDocClient.send(new QueryCommand(params));
    console.log(`getRoomsCount Data: ${JSON.stringify(data)}`);
    return data.Count;
};

// Function to get the count of customers from the Users table
const getCustomerUsersCount = async (usersTableName) => {
    const params = {
        TableName: usersTableName,
        FilterExpression: 'user_type = :userType',
        ExpressionAttributeValues: {
            ':userType': 'customer',
        },
        Select: 'COUNT',
    };
    console.log(`getCustomerUsersCount Params: ${JSON.stringify(params)}`);
    const data = await ddbDocClient.send(new ScanCommand(params));
    return data.Count;
};