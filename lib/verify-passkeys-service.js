require('dotenv').config();
const axios = require('axios');
//const {config} = require("dotenv");
const {randomStr} = require('./utils')

const accountSid = process.env.ACCOUNT_SID || "AC1a08114ea63eaa198f74924fedae2842";

// Axios Client declaration
const host = process.env.VERIFY_PASSKEYS_HOST || "localhost"

const api = axios.create({
    baseURL: 'http://' + host + ':1720/v1',
    timeout: process.env.TIMEOUT || 5000,
});

// Generic POST request function
const post = async (url, body) => {
    const headers = {
        'I-Twilio-Auth-Account': accountSid,
        'T-Request-Id': 'RQ' + randomStr(32)
    }
    try {
        const response = await api.post(url, body, {
            headers: headers
        });
        const {status, data} = response;
        if (status === 201 || status === 200) {
            return data;
        }
    } catch (err) {
        throw new Error(err.code + " " + err.message);
    }
};

module.exports = {
    createFactor: (serviceSid, body) => post(`/Services/${serviceSid}/Factors`, body),
    verifyFactor: (serviceSid, body) => post(`/Services/${serviceSid}/Factors/Verify`, body),
    createChallenge: (serviceSid, body) => post(`/Services/${serviceSid}/Challenges`, body),
    verifyChallenge: (serviceSid, body) => post(`/Services/${serviceSid}/Challenges/Verify`, body),
};