type uuid = string;
type userId = uuid;

[@bs.deriving abstract]
type user = {
  id: userId,
  displayName: string,
};

let toUser = (dict) => {
  switch (Js.Dict.get(dict, "id")) {
    | None => Belt.Result.Error("User ID could not be found");
    | Some(userIdJson) => {
      switch (Js.Json.classify(userIdJson)) {
        | Js.Json.JSONString(userId) => {
          switch (Js.Dict.get(dict, "displayName")) {
            | None => Belt.Result.Error("User Display Name could not be found");
            | Some(displayNameJson) => {
              switch (Js.Json.classify(displayNameJson)) {
                | Js.Json.JSONString(displayName) => {
                  Belt.Result.Ok(user(~displayName, ~id=userId ));
                }
                | _ => Belt.Result.Error("Display Name is not a string");
              }
            }
          }
        }
        | _ => Belt.Result.Error("User ID is not a string");
      }
    }
  }
};
