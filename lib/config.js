const express = require('express')
const router = express.Router()

let baseUrl;
let hostName;

let accountSid = process.env.ACCOUNT_SID;
let authToken = process.env.AUTH_TOKEN;
let serviceSid = process.env.SERVICE_SID;

router.post('/', async (req, res, next) => {
    console.log("Verify Passkeys update config call.")
    try {
        const requestBody = req.body;
        accountSid = requestBody.accountSid;
        authToken = requestBody.authToken;
        serviceSid = requestBody.serviceSid;
        res.send({accountSid, authToken, serviceSid});
    } catch (err) {
        res.status(500).send(err.message);
    }
})

router.get('/', async (req, res, next) => {
    console.log("Verify Passkeys get config call.")
    try {
        res.send({accountSid, authToken, serviceSid});
    } catch (err) {
        res.status(500).send(err.message);
    }
})


module.exports = {
    router,
    /**
     * @param url : string
     */
    setUrl: (url) => {
        baseUrl = url;
        hostName = new URL(url).hostname;
    },
    /**
     * @returns {string}
     */
    getUrl: () => baseUrl,
    /**
     * @returns {string}
     */
    getHostName: () => hostName,

    getAccountSid: () => accountSid,

    getAccountAuthToken: () => authToken,

    getServiceSid: () => serviceSid
}