import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { CognitoIdentityProviderClient, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import crypto from 'crypto';

const ddbClient = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(ddbClient);
const cognitoClient = new CognitoIdentityProviderClient({ region: 'us-east-1' });

export const handler = async (event) => {
  const { user_type, fullname, email, password, userName, phone_no, age, address, question, answer, key } = JSON.parse(event.body);
  let responseBody = "";
  let statusCode = 0;
  const tableName = process.env.UserDalVacationDynamoTableName;

  try {
    // Encrypt the password
    const algorithm = 'aes256';
    const cipherKey = 'password';
    const cipher = crypto.createCipher(algorithm, cipherKey);
    const encryptedPassword = cipher.update(password, 'utf8', 'hex') + cipher.final('hex');

    // Sign up user in Cognito
    const signUpParams = {
      ClientId: process.env.DalVacationHomeAppClientId,
      Username: email, // Use email as the username for Cognito registration
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'name', Value: fullname },
        { Name: 'phone_number', Value: phone_no },
        { Name: 'address', Value: address }
      ]
    };

    const signUpCommand = new SignUpCommand(signUpParams);
    const signUpResponse = await cognitoClient.send(signUpCommand);

    // Check if user already exists in DynamoDB
    const user = await dynamo.send(
      new GetCommand({
        TableName: tableName,
        Key: {
          email: email, // Assuming email as the unique identifier
        },
      })
    );

    if (!user.Item) {
      // Store user details in DynamoDB
      const userItem = {
        user_type: user_type,
        fullname: fullname,
        email: email,
        password: encryptedPassword,
        userName: userName,
        phone_no: phone_no,
        age: age,
        address: address,
        question: question,
        answer: answer,
        key: key
      };

      const putCommand = new PutCommand({
        TableName: tableName,
        Item: userItem
      });
      await dynamo.send(putCommand);

      responseBody = JSON.stringify(signUpResponse);
      statusCode = 200;
    } else {
      responseBody = "User already exists";
      statusCode = 403;
    }
  } catch (error) {
    responseBody = `Unable to register user: ${error.message}`;
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
