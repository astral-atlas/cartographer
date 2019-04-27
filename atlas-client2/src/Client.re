type url = string;
type headers = list((string, string));

type authentication =
  | Basic(string, string)

type connection = {
  auth: authentication,
  domain: url,
}

type user = {
  id: string,
  displayName: string,
};

type client = {
  getUsers: unit => Js.Promise.t(Result.result(list(user), unit)),
}

let emptyUsers: Result.result(list(user), unit) = Result.Success([]);

let createClient = (get: (~url: string, ~headers: option(headers)) => Js.Promise.t(string), connection): client => {
  {
    getUsers: () => {
      let url = connection.domain ++ "/users";
      let headers = None;
      Js.Promise.then_(
        unit => {
          Js.Promise.resolve(emptyUsers);
        },
        get(~url, ~headers),
      );
    }
  }
};