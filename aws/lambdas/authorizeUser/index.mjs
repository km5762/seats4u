import jwt from "jsonwebtoken";
import fs from "fs";

const jwtSecret = fs.readFileSync("private.key");

const Role = Object.freeze({ ADMIN: 1, VENUE_MANAGER: 2 });

// A simple token-based authorizer example to demonstrate how to use an authorization token
// to allow or deny a request. In this example, the caller named 'user' is allowed to invoke
// a request if the client-supplied token value is 'allow'. The caller is not allowed to invoke
// the request if the token value is 'deny'. If the token value is 'unauthorized' or an empty
// string, the authorizer function returns an HTTP 401 status code. For any other token value,
// the authorizer returns an HTTP 500 status code.
// Note that token values are case-sensitive.

export const handler = function (event, context, callback) {
  const cookie = event.headers.cookie;

  if (!cookie) {
    callback("Error: Cookie missing");
  }

  const token = cookie.split("=")[1];

  let user;
  try {
    user = jwt.verify(token, jwtSecret);
  } catch (error) {
    callback(error);
  }

  switch (user.roleId) {
    case Role.ADMIN:
      callback(null, generatePolicy("user", "Allow", event.routeArn, user));
      break;
    case Role.VENUE_MANAGER:
      if (
        event.routeArn.includes("listvenues") ||
        event.routeArn.includes("generateshowsreport") ||
        event.routeArn.includes("deleteevent")
      ) {
        callback(null, generatePolicy("user", "Deny", event.routeArn, user));
      } else {
        callback(null, generatePolicy("user", "Allow", event.routeArn, user));
      }
      break;
    default:
      callback("Error: Invalid roleId"); // Return a 500 Invalid token response
  }
};

// Help function to generate an IAM policy
var generatePolicy = function (principalId, effect, resource, context) {
  var authResponse = {};

  authResponse.principalId = principalId;
  if (effect && resource) {
    var policyDocument = {};
    policyDocument.Version = "2012-10-17";
    policyDocument.Statement = [];
    var statementOne = {};
    statementOne.Action = "execute-api:Invoke";
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }

  // Optional output with custom properties of the String, Number or Boolean type.
  authResponse.context = context;
  return authResponse;
};
