import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

const s3 = new S3Client({});

const ROOMS_TABLE = process.env.RoomsTableName;
const BUCKET_NAME = process.env.HotelRoomImagesBucketName;

export const handler = async (event) => {
  const { agent_email, room_number, room_type, price, features, file_content_base64, file_type } = event;

  const file_content = Buffer.from(file_content_base64, 'base64');
  const file_name = `room-${room_number}.${file_type}`;

  try {
    let scanParams = {
      TableName: ROOMS_TABLE,
      FilterExpression: "room_number = :room_number",
      ExpressionAttributeValues: {
        ":room_number": room_number
      }
    };

    const existingRooms = await dynamodb.send(new ScanCommand(scanParams));

    if (existingRooms.Count > 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Room number already exists' }),
      };
    }

    scanParams = {
      TableName: ROOMS_TABLE,
      ProjectionExpression: "room_id"
    };

    const data = await dynamodb.send(new ScanCommand(scanParams));
    const maxRoomId = data.Items.reduce((max, item) => Math.max(max, parseInt(item.room_id)), 0);

    const newRoomId = (maxRoomId + 1).toString();
    
    const s3Params = {
      Bucket: BUCKET_NAME,
      Key: file_name,
      Body: file_content,
      ContentType: `image/jpeg`
    };

    await s3.send(new PutObjectCommand(s3Params));

    const image_url = `https://${BUCKET_NAME}.s3.amazonaws.com/${file_name}`;

    const params = {
      TableName: ROOMS_TABLE,
      Item: {
        agent_email: agent_email,
        room_id: newRoomId,
        room_number,
        room_type,
        price,
        features,
        image_url
      }
    };

    await dynamodb.send(new PutCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Room added successfully', room_id: newRoomId }),
    };
  }
  catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to add room', error: error.message }),
    };
  }
};
