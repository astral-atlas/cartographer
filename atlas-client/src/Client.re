open Belt.Result;
open Belt.Array;

type authentication =
  | Basic(string, string);

type connection = {
  auth: authentication,
  domain: string,
};

[@bs.deriving abstract]
type t = {
  getUsers: unit => Js.Promise.t(array(Users.user)),
}

let createBasicAuthentication = (username, password) => {
  Basic(username, password);
}

let createConnection = (auth, domain) => {
  { auth, domain }
}

let toArray = (toElement, json) => {
  switch (Js.Json.classify(json)) {
    | Js.Json.JSONArray(array) => reduce(
        array,
        Ok([||]),
        (arraySoFarOrError, currentElement) => {
          switch (arraySoFarOrError) {
            | Error(message) => Error(message);
            | Ok(arraySoFar) => {
              switch (toElement(currentElement)) {
                | Ok(element) => Ok(concat(arraySoFar, [|element|]));
                | Error(message) => Error(message);
              }
            }
          }
        }
      );
    | _ => Error("JSON was not an Array");
  }
};

let toUserArray = toArray(element =>
  switch (Js.Json.classify(element)) {
    | Js.Json.JSONObject(dict) => Users.toUser(dict);
    | _ => Error("Element was not an object");
  }
);

let createClient = (get, connection, toBase64): t => {
  let authenticationHeaders = switch (connection.auth) {
    | Basic(username, password) => [| ("Authorization", toBase64(username ++ ":" ++ password)) |]
  }
  let getUsers = () => {
      let url = connection.domain ++ "/users";
      let headers = authenticationHeaders;
      get(url, headers)
        |> Js.Promise.then_(body => {
            let json = Js.Json.parseExn(body);
            switch(toUserArray(json)) {
              | Ok(users) => Js.Promise.resolve(users);
              | Error(errorMessage) => Js.Promise.reject(Js.Exn.raiseError(errorMessage));
            }
          });
    };
  t( ~getUsers );
};