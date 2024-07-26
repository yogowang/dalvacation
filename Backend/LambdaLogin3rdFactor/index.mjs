import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

//https://medium.com/@stheodorejohn/implementing-caesar-cipher-in-javascript-for-secure-communication-6f82bbe914c2
const ddbClient = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(ddbClient);
const lambdaClient = new LambdaClient({ region: 'us-east-1' });
const snsNotificationLambdaName = process.env.LambdaSNSNotificationName;

const caesarCipherDecrypt = (str, key) => {
  return str.split('')
    .map(char => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 - key + 26) % 26) + 65);
      }
      if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 - key + 26) % 26) + 97);
      }
      return char;
    })
    .join('');
};

export const handler = async (event) => {
  const { email, word, decryptedWord, user_type } = event;
  let responseBody = "";
  let statusCode = 0;
  const tableName = process.env.UserDalVacationDynamoTableName;

  try {
    const user = await dynamo.send(
      new GetCommand({
        TableName: tableName,
        Key: {
          email: email,
          user_type: user_type
        },
      })
    );

    if (user.Item) {
      const key = parseInt(user.Item.key, 10);
      const decrypted = caesarCipherDecrypt(word, key);
      console.log("decrypted: ", decrypted);
      console.log("decryptedWord: ", decryptedWord);

      if (decrypted === decryptedWord) {
        responseBody = "Third factor authentication successful";
        statusCode = 200;

        const subject = `Login Successful`;
        const message = `Hi ${user.Item.fullname}.\n\nYour login to Dal Vacation Home was successful.\n\nBest,\nDal Vacation Home Team`;

        // Construct parameters for invoking Notification Lambda function
        const params = {
          FunctionName: snsNotificationLambdaName,
          InvocationType: 'Event', // Asynchronous invocation
          Payload: JSON.stringify({ email: email, message: message, subject: subject })
        };
        // Invoke Success Login Notification
        await lambdaClient.send(new InvokeCommand(params));

      } else {
        responseBody = "Decryption failed:";
        statusCode = 403;
      }
    } else {
      responseBody = "User not found";
      statusCode = 404;
    }
  } catch (error) {
    responseBody = `Third factor authentication failed: ${error.message}`;
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
