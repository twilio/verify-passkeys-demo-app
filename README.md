# Verify Passkeys Demo Application

This is a project demo of Twilio Verify Passkeys.
For WebAuthn invocations, the [webauthn-json](https://github.com/github/webauthn-json/tree/main) library is used.

## How To Install The App
Requires Node version ≥ 18.11.0

```shell
npm install 
```

## Ngrok Setup
[Ngrok](https://ngrok.com/) creates a publicly accessible URL that you can use to send HTTP/HTTPS traffic to a server running on your localhost.
In order to make the ngrok url sharable with others, follow the steps below
to help ngrok generate urls differently:

1. Sign up for a free account on [Ngrok](https://dashboard.ngrok.com/signup)
2. Confirm email address
3. Add Ngrok auth token to the local ngrok agent config using the below command ([docs](https://dashboard.ngrok.com/get-started/your-authtoken)):

        ngrok config add-authtoken TOKEN

## Configure
Make sure to configure the app to use your Twilio details before using the application.
Either update the `.env` file before running the app, or do it in the browser UI once the app is running under the `About` tab.


```text
ACCOUNT_SID=your-account-sid-here
AUTH_TOKEN=your-auth-token-here
SERVICE_SID=your-service-sid-here
```

## Run Your App

```shell
npm start
```
and open browser with address from console log, for example:  
```shell
listening on 3000
url: https://8168-194-106-101-11.ngrok-free.app
```

Alternatively instead of above url one can always navigate to the
`http://localhost:3000/` in their browser to access web app.

_Note:_ if you haven't done the [Ngrok pre-setup](#ngrok-pre-setup) steps above and do not
have ngrok authtoken installed, then the generated url will look different
(it will be under different subdomain, i.e. `https://7f64-107-20-166-29.ngrok.io`)
and it might not be accessible by others.

## Logging
In the demo application there are multiple logs written to the console.

- For requests hitting the Twilio REST API, the logs will be prefixed with `[Twilio API]`.
- For requests hitting the demo backend server, the logs will be prefixed with `[Server]`.
- For requests hitting the demo frontend server, the logs will be prefixed with `[Client]`.

## License
[MIT License](LICENSE)

## Contributing
[Contributing](CONTRIBUTING.md)