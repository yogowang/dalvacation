import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

//setup dynamo db client
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const getActionSteps = async (websiteAction) => {
    const command = new GetCommand({
        TableName: "navigate_website",
        Key: {
            "action": websiteAction,
        },
    });

    const data = await ddbDocClient.send(command);

    return data.Item.steps;
};

export const handler = async (event) => {
    console.log(event)

    const websiteAction = event.queryResult.parameters.websiteaction;
    const intentName = event.queryResult.intent.displayName;
    const bookingReferenceNumber = event.queryResult.parameters.any;
    const signUpQueryList = ["register", "create account", "create an account", "signup"];

    let steps;
    let response;

    if (intentName === "NavigateWebsite") {
        if (websiteAction === "login") {
            steps = await getActionSteps(websiteAction);
        }
        else if (signUpQueryList.includes(websiteAction)) {
            steps = await getActionSteps("signup");
        }
        else if (websiteAction === "book a room") {
            steps = await getActionSteps("book_room");
        }
        else if (websiteAction === "feedback") {
            steps = await getActionSteps("feedback")
        }
        else if (websiteAction === "logout") {
            steps = await getActionSteps("logout")
        }
        response = {
            "fulfillmentText": steps
        };
    }
    else if (intentName === "BookingDetails") {
        // get details from dynamo db
        const command = new GetCommand({
            TableName: "CustomerBookings",
            Key: {
                "booking_reference_code": bookingReferenceNumber,
            },
        });

        const bookingData = await ddbDocClient.send(command);
        const bookingDetails = `Booking Reference Code: ${bookingData.Item.booking_reference_code} \n
                            Start Date: ${bookingData.Item.start_date} \n
                            End Date: ${bookingData.Item.end_date} \n
                            Total Days: ${bookingData.Item.total_days} \n
                            Total Amount: ${bookingData.Item.total_amount}`
        response = {
            "fulfillmentText": bookingDetails
        };
    }

    return response;
};
