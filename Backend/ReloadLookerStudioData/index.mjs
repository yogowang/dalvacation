import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

const lambdaClient = new LambdaClient({});

export const handler = async (event) => {
    console.log('Received event:', JSON.stringify(event));

    const { agentEmail } = event;
    console.log('Agent email:', agentEmail);

    const triggerLambda1 = process.env.GetFeedbackByAgentLambdaName;
    const triggerLambda2 = process.env.GetBookingsByAgentLambdaName;
    const triggerLambda3 = process.env.GetMetricesByAgentLambdaName;

    if (!agentEmail) {
        console.log('Missing agentEmail query parameter');
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing agentEmail query parameter' }),
        };
    }

    try {
        // Prepare the payload for the Lambdas
        const payload = {
            agentEmail: agentEmail
        };

        console.log('Payload prepared:', JSON.stringify(payload));

        // Define the invoke parameters for each Lambda function
        const invokeParams1 = {
            FunctionName: triggerLambda1,
            Payload: JSON.stringify(payload),
        };
        const invokeParams2 = {
            FunctionName: triggerLambda2,
            Payload: JSON.stringify(payload),
        };
        const invokeParams3 = {
            FunctionName: triggerLambda3,
            Payload: JSON.stringify(payload),
        };

        console.log('Invoke parameters set for each Lambda:', {
            invokeParams1,
            invokeParams2,
            invokeParams3
        });

        // Trigger all Lambdas simultaneously
        const results = await Promise.allSettled([
            lambdaClient.send(new InvokeCommand(invokeParams1)),
            lambdaClient.send(new InvokeCommand(invokeParams2)),
            lambdaClient.send(new InvokeCommand(invokeParams3))
        ]);

        console.log('Results from all Lambdas:', JSON.stringify(results));

        // Process the results
        const responses = results.map((result, index) => {
            if (result.status === 'fulfilled') {
                console.log(`Lambda ${index + 1} fulfilled:`, result.value);
                return {
                    status: 'fulfilled',
                    functionName: [triggerLambda1, triggerLambda2, triggerLambda3][index],
                    response: JSON.parse(new TextDecoder('utf-8').decode(result.value.Payload)),
                };
            } else {
                console.log(`Lambda ${index + 1} rejected:`, result.reason);
                return {
                    status: 'rejected',
                    functionName: [triggerLambda1, triggerLambda2, triggerLambda3][index],
                    reason: result.reason,
                };
            }
        });

        console.log('Processed responses from Lambdas:', JSON.stringify(responses));

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'All Lambdas invoked successfully',
                responses: responses,
            }),
        };
    } catch (error) {
        console.error('Error invoking Lambdas:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error invoking Lambdas',
            }),
        };
    }
};
