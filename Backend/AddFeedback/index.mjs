//https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-example-dynamodb-utilities.html
//https://codedamn.com/news/javascript/how-to-convert-timestamp-to-date-in-javascript
//https://console.cloud.google.com/vertex-ai/generative/language/prompt-examples/Sentiment%20analysis
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import crypto from 'crypto';
import axios from 'axios';
const ddbClient = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(ddbClient);
const API_ENDPOINT = process.env.API_ENDPOINT;
async function analyzeSentiment(text) {
  const prompt = "just print out the sentiment without anything else. Input:";
  text = prompt + text;
  const requestData = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: text
          },
        ]
      }
    ],
    generationConfig: {
      maxOutputTokens: 8192,
      temperature: 1,
      topP: 0.95
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      }
    ]
  };

  const response = await axios.post(API_ENDPOINT, requestData, {
    headers: {
      "Authorization": `Bearer ${process.env.GOOGLE_API_ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    }
  });

  return response.data;
}
export const handler = async (event) => {
  const { email, text, room_id } = event;
  const feedback_id = crypto.randomUUID();
  const timestamp = Date.now();
  const date = new Date(timestamp).toDateString();
  let responseBody = "";
  let statusCode = 0;
  const tableName = process.env.FeedbackDalVacationDynamoTableName;

  try {
    const sentiment = await analyzeSentiment(text);
    await dynamo.send(
      new PutCommand({
        TableName: tableName,
        Item: {
          feedback_id: feedback_id,
          timestamp: timestamp,
          email: email,
          room_id_index: room_id,
          text: text,
          date: date,
          sentiment: sentiment[0]["candidates"][0]["content"]["parts"][0]["text"]
        },
      })
    );
    responseBody = 'feedback submitted';
    statusCode = 200;
  } catch (error) {
    responseBody = `submission failed: ${error.message}`;
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