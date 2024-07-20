//https://rambabusaravanan.medium.com/understanding-dynamodb-items-select-count-991af93418fa
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

const tableName = process.env.UserDalVacationDynamoTableName;

export const handler = async (event) => {
  console.log(event)

  try {
    const params = {
      TableName: tableName,
      Select: 'COUNT'
    };

    const data = await dynamodb.send(new ScanCommand(params));

    if (!data.Count) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'No users table' }),
      };
    }

    return {
      statusCode: 200,
      body: {count: data.Count},
    };
  }
  catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to get user numbers', error: error.message }),
    };
  }
};