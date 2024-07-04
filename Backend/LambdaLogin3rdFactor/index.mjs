import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
//https://medium.com/@stheodorejohn/implementing-caesar-cipher-in-javascript-for-secure-communication-6f82bbe914c2
const ddbClient = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(ddbClient);

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
  const { email, word, decryptedWord } = event;
  let responseBody = "";
  let statusCode = 0;
  const tableName = process.env.UserDalVacationDynamoTableName;

  try {
    const user = await dynamo.send(
      new GetCommand({
        TableName: tableName,
        Key: {
          email: email,
        },
      })
    );

    if (user.Item) {
      const key = parseInt(user.Item.key, 10);
      const decrypted = caesarCipherDecrypt(word, key);

      if (decrypted === decryptedWord) {
        responseBody = "Third factor authentication successful";
        statusCode = 200;
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
