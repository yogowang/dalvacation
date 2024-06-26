//source:https://stackoverflow.com/questions/54988235/how-can-i-parse-event-parametet-in-lambda
//source:https://gist.github.com/dfbq91/da80607e23330ca082c30d6574c74fb1
//source:https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-dynamo-db.html
//source:https://stackoverflow.com/questions/53636014/check-if-a-dynamodb-table-contains-a-key-and-return-a-boolean
//source:https://medium.com/@vuongtran/using-node-js-bcrypt-module-to-hash-password-5343a2aa2342
//source:https://www.freecodecamp.org/news/how-to-hash-passwords-with-bcrypt-in-nodejs/
//source:https://stackoverflow.com/questions/6953286/how-to-encrypt-data-that-needs-to-be-decrypted-in-node-js
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import crypto from 'crypto';
export const handler = async (event) => {
  const client = new DynamoDBClient({});
  const dynamo = DynamoDBDocumentClient.from(client);
  const user_id=JSON.parse(event.body).user_id;
  const email=JSON.parse(event.body).email;
  var password=JSON.parse(event.body).password;
  const userName=JSON.parse(event.body).userName;
  let responseBody = "";
  let statusCode = 0;
  let tableName="user-dalVacation";
  var algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
  var key = 'password';
  var cipher = crypto.createCipher(algorithm, key);  
  password = cipher.update(password, 'utf8', 'hex') + cipher.final('hex');
  const body={
            user_id: user_id,
            email: email,
            password:password,
            userName: userName
  }
  try {
   const user=await dynamo.send(
          new GetCommand({
            TableName: tableName,
            Key: {
              user_id: user_id,
            },
          })
        );
        if(!user.Item){
      await dynamo.send(
          new PutCommand({
            TableName:tableName,
            Item:body
          })
        );
      responseBody = JSON.stringify(body)
      statusCode = 200;
        }
        else{
          responseBody="user already exist"
          statusCode = 403;
        }
  } catch (err) {
      responseBody = `Unable to put Product: ${err}`;
      statusCode = 403;
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
