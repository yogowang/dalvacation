import { CognitoIdentityProviderClient, InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";

const cognitoClient = new CognitoIdentityProviderClient({ region: 'us-east-1' });

export const handler = async (event) => {
  const { email, password } = event;
  let responseBody = "";
  let statusCode = 0;

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

    responseBody = JSON.stringify(authResponse);
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
