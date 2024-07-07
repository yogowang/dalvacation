import { CognitoIdentityProviderClient, AdminConfirmSignUpCommand } from "@aws-sdk/client-cognito-identity-provider";

const cognitoClient = new CognitoIdentityProviderClient({ region: 'us-east-1' });
const userPoolId = process.env.DalVacationHomeUserPoolId;
const clientId = process.env.DalVacationHomeAppClientId;

export const handler = async (event) => {
  const { email, confirmationCode } = event;
  let responseBody = "";
  let statusCode = 0;

  try {
    const confirmParams = {
      UserPoolId: userPoolId,
      Username: email,
      ConfirmationCode: confirmationCode,
      ClientId: clientId
    };

    const confirmCommand = new AdminConfirmSignUpCommand(confirmParams);
    await cognitoClient.send(confirmCommand);

    responseBody = "User confirmed successfully";
    statusCode = 200;
  } catch (error) {
    responseBody = `Confirmation failed: ${error.message}`;
    statusCode = 500;
  }

  const response = {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(responseBody)
  };

  return response;
};
