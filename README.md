# Verify Passkeys customer emulator

This is a project demo of Twilio Verify Passkeys customer  
It emulates the client and server side of customer.

For WebAuthn invocations the library https://github.com/github/webauthn-json/tree/main is used  

## Install
Desirable version of Node.js => 18.11.0

```shell
npm install 
```

## Ngrok pre-setup
In order to make ngrok url sharable with others one might want to follow the steps below
to help ngrok generate urls differently

1. create ngrok free account via `https://dashboard.ngrok.com/signup`
2. confirm account email
3. install ngrok auth token from your local cabinet (`https://dashboard.ngrok.com/get-started/your-authtoken`) using the command

        ngrok config add-authtoken TOKEN

## Run

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

Note: if you haven't done the "Ngrok pre-setup" steps above and do not
have ngrok authtoken installed, then the generated url will look different
(it will be under different subdomain, i.e. `https://7f64-107-20-166-29.ngrok.io`)
and it might not be accessible by others.

