import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

export const handler = async (event) => {
    const { agentEmail } = event
    const roomsTableName = process.env.RoomsDalVacationDynamoTableName;
    const usersTableName = process.env.UserDalVacationDynamoTableName;
    const bookingsTableName = process.env.BookingsDalVacationDynamoTableName;

    if (!agentEmail) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing agent_email query parameter' }),
        };
    }

    try {
        const [roomsCount, usersCount, totalEarnings] = await Promise.all([
            getRoomsCount(agentEmail, roomsTableName),
            getCustomerUsersCount(usersTableName),
            getTotalEarningsForAgent(agentEmail, bookingsTableName)
        ]);

        const response = {
            statusCode: 200,
            body: JSON.stringify({
                totalRooms: roomsCount,
                totalUsers: usersCount,
                totalEarnings: totalEarnings,
            }),
        };

        return response;
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
        IndexName: 'agent_email',
        KeyConditionExpression: 'agent_email = :agentEmail',
        ExpressionAttributeValues: {
            ':agentEmail': agentEmail,
        },
        Select: 'COUNT',
    };

    const data = await ddbDocClient.send(new QueryCommand(params));
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

    const data = await ddbDocClient.send(new ScanCommand(params));
    return data.Count;
};

// Function to calculate the total earnings for rooms associated with a specific agent_email
const getTotalEarningsForAgent = async (agentEmail, bookingsTableName) => {
    let totalEarnings = 0;
    let lastEvaluatedKey = null;

    // Query to get room_ids for the agent
    const roomsParams = {
        TableName: bookingsTableName,
        IndexName: 'agent_email', // Ensure this index exists or replace with correct index if using a different one
        KeyConditionExpression: 'agent_email = :agentEmail',
        ExpressionAttributeValues: {
            ':agentEmail': agentEmail,
        },
        ProjectionExpression: 'room_id',
    };

    const roomsData = await ddbDocClient.send(new QueryCommand(roomsParams));
    const roomIds = roomsData.Items.map(item => item.room_id);

    // Scan the bookings table for the total earnings
    do {
        const bookingsParams = {
            TableName: 'BookingsTable',
            FilterExpression: 'room_id IN (:roomIds)',
            ExpressionAttributeValues: {
                ':roomIds': roomIds,
            },
            ProjectionExpression: 'total_amount',
            ExclusiveStartKey: lastEvaluatedKey,
        };

        const bookingsData = await ddbDocClient.send(new ScanCommand(bookingsParams));

        bookingsData.Items.forEach(item => {
            totalEarnings += item.total_amount;
        });

        lastEvaluatedKey = bookingsData.LastEvaluatedKey;
    } while (lastEvaluatedKey);

    return totalEarnings;
};
