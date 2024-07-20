import { CognitoIdentityProviderClient, InitiateAuthCommand, GetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const ddbClient = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(ddbClient);
const cognitoClient = new CognitoIdentityProviderClient({ region: 'us-east-1' });

export const handler = async (event) => {
  const { email, password, user_type } = event;
  console.log(`Received Event: email-${email} user_type-${user_type}`);
  let responseBody = "";
  let statusCode = 0;
  const tableName = process.env.UserDalVacationDynamoTableName;

  try {
    // Step 1: Authenticate user
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
    console.log(`authResponse: ${JSON.stringify(authResponse)}`);

    // Step 2: Fetch user attributes from Cognito
    const accessToken = authResponse.AuthenticationResult.AccessToken;
    const getUserCommand = new GetUserCommand({
      AccessToken: accessToken
    });
    const getUserResponse = await cognitoClient.send(getUserCommand);
    console.log(`getUserResponse: ${JSON.stringify(getUserResponse)}`);

    const registered_user_type = getUserResponse.UserAttributes.find(attr => attr.Name === 'custom:user_type').Value;
    console.log(`registered_user_type: ${registered_user_type}`);

    if (registered_user_type !== user_type) {
      throw new Error(`User type mismatch Registered User: ${registered_user_type}`);
    }

    // Step 3: Retrieve user data from DynamoDB
    const user = await dynamo.send(
      new GetCommand({
        TableName: tableName,
        Key: {
          email: email
        },
      })
    );

    let userQAQuestion = "N/A";
    if (user.Item) {
      userQAQuestion = user.Item.question;
    } else {
      responseBody = "User not found";
      statusCode = 404;
    }

    responseBody = { authResponse, userQAQuestion, registered_user_type }
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
    body: JSON.stringify(responseBody)
  };
  console.log(response);
  return response;
};
