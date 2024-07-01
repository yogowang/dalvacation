import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const ddbClient = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(ddbClient);

export const handler = async (event) => {
  const { email,question_id ,answer } = JSON.parse(event.body);
  let responseBody = "";
  let statusCode = 0;
  const tableName = process.env.UserQuestionDalVacationDynamoTableName;

  try {
    const user = await dynamo.send(
      new GetCommand({
        TableName: tableName,
        Key: {
          email: email,
          question_id:question_id
        },
      })
    );

    if (user.Item) {
      if (user.Item.answer === answer) {
        responseBody = "Second factor authentication successful";
        statusCode = 200;
      } else {
        responseBody = "Incorrect answer";
        statusCode = 403;
      }
    } else {
      responseBody = "User not found";
      statusCode = 404;
    }
  } catch (error) {
    responseBody = `Second factor authentication failed: ${error.message}`;
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
