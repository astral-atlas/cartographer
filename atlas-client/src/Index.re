[@bs.deriving abstract]
type clientModule = {
  createClient: ((string, array((string, string))) => Js.Promise.t(string), Client.connection, string => string) => Client.t,
  createBasicAuthentication: (string, string) => Client.authentication,
  createConnection: (Client.authentication, string) => Client.connection,
}

let createClient = Client.createClient;
let createBasicAuthentication = Client.createBasicAuthentication;
let createConnection = Client.createConnection;

let clientModule = clientModule(~createClient, ~createBasicAuthentication, ~createConnection);
