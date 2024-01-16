const express = require('express')
const router = express.Router()

let baseUrl;
let hostName;

let accountSid = process.env.ACCOUNT_SID || "AC1a08114ea63eaa198f74924fedae2842";
let serviceSid = process.env.SERVICE_SID || "VA123456789012345678901234567890bb";

router.post('/', async (req, res, next) => {
    console.log("Verify Passkeys update config call.")
    try {
        const requestBody = req.body;
        accountSid = requestBody.accountSid;
        serviceSid = requestBody.serviceSid;
        res.send({accountSid, serviceSid});
    } catch (err) {
        res.status(500).send(err.message);
    }
})

router.get('/', async (req, res, next) => {
    console.log("Verify Passkeys get config call.")
    try {
        res.send({accountSid, serviceSid});
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

    setAccountSid: (sid) => {
        accountSid = sid;
    },
    getAccountSid: () => accountSid,

    setServiceSid: (sid) => {
        serviceSid = sid;
    },
    getServiceSid: () => serviceSid
}