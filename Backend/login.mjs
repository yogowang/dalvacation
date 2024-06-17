//source:https://medium.com/@sgrharasgama/implementing-and-testing-aws-cognito-in-node-js-applications-5bc435e83184
//source:https://docs.aws.amazon.com/cognito/latest/developerguide/authentication.html
import {
    CognitoUserPool,
    CognitoUser,
    AuthenticationDetails
} from 'amazon-cognito-identity-js';

export const handler = async (event) => {
  const username=JSON.parse(event.body).username;
  const password=JSON.parse(event.body).password;
  let message='';
  var authenticationData = {
        Username : username,
        Password : password,
    };
    var authenticationDetails = new AuthenticationDetails(authenticationData);
    var poolData = { UserPoolId : 'us-east-1_aaafDYbYj',
        ClientId : 'saintpepsi'
    };
    var userPool = new CognitoUserPool(poolData);
    var userData = {
        Username : password,
        Pool : userPool
    };
    var cognitoUser = new CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            var accessToken = result.getAccessToken().getJwtToken();
            
            /* Use the idToken for Logins Map when Federating User Pools with identity pools or when passing through an Authorization Header to an API Gateway Authorizer */
            var idToken = result.idToken.jwtToken;
            message='User authentication successful'
        },

        onFailure: function(err) {
          message='User authentication failed'
            alert(err);
        },

});
        const response = {
            statusCode: 200,
            body: JSON.stringify({
                message: message
            }),
        };
        return response;
};