import { CognitoIdentityProviderClient, AdminConfirmSignUpCommand, AdminGetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { SNSClient, SubscribeCommand } from "@aws-sdk/client-sns";

const cognitoClient = new CognitoIdentityProviderClient({ region: 'us-east-1' });
const snsClient = new SNSClient({ region: 'us-east-1' });

const userPoolId = process.env.DalVacationHomeUserPoolId;
const clientId = process.env.DalVacationHomeAppClientId;
const snsTopicArn = process.env.DalVacationHomeSnsTopicArn;

export const handler = async (event) => {
  const { email, confirmationCode } = event;
  console.log("Received Event:", event);
  console.log("userPoolId:", userPoolId);
  console.log("clientId:", clientId);
  console.log("snsTopicArn:", snsTopicArn);

  let responseBody = "";
  let statusCode = 0;

  try {
    // Check if user exists in Cognito before confirming
    const getUserParams = {
      UserPoolId: userPoolId,
      Username: email
    };
    const getUserCommand = new AdminGetUserCommand(getUserParams);
    await cognitoClient.send(getUserCommand);

     // Confirm user sign-up in Cognito
     const confirmParams = {
      UserPoolId: userPoolId,
      Username: email,
      ConfirmationCode: confirmationCode,
      ClientId: clientId
    };
    const confirmCommand = new AdminConfirmSignUpCommand(confirmParams);
    await cognitoClient.send(confirmCommand);

    // Subscribe user's email to the SNS topic
    const subscribeParams = {
      TopicArn: snsTopicArn,
      Protocol: 'email',
      Endpoint: email,
      Attributes: {
        FilterPolicy: JSON.stringify({
          email: [email]
        })
      }
    };
    await snsClient.send(new SubscribeCommand(subscribeParams));

    responseBody = "User confirmed successfully, subscribed to SNS";
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
