import { CognitoIdentityProviderClient, InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const ddbClient = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(ddbClient);
const cognitoClient = new CognitoIdentityProviderClient({ region: 'us-east-1' });

export const handler = async (event) => {
  const { email, password } = event;
  let responseBody = "";
  let statusCode = 0;
  const tableName = process.env.UserDalVacationDynamoTableName;

  try {
    const authParams = { 
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: process.env.DalVacationHomeAppClientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password
      }
    };

    const authCommand = new InitiateAuthCommand(authParams);
    const authResponse = await cognitoClient.send(authCommand);

    const user = await dynamo.send(
      new GetCommand({
        TableName: tableName,
        Key: {
          email: email
        },
      })
    );

    const userQAQuestion = "N/A";
    if (user.Item) {
      userQAQuestion = user.Item.question;
    } else {
      responseBody = "User not found";
      statusCode = 404;
    }

    responseBody = JSON.stringify(authResponse, userQAQuestion);
    statusCode = 200;
  } catch (error) {
    responseBody = `Login failed: ${error.message}`;
    statusCode = 500;
  }

  const response = {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json"
    },
    body: responseBody
  };
  return response;
};
