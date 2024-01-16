require('dotenv').config();
const axios = require('axios');
const {getAccountSid} = require('./config');
const {randomStr} = require('./utils')

// Axios Client declaration
const host = process.env.VERIFY_PASSKEYS_HOST || "localhost"

const api = axios.create({
    baseURL: 'http://' + host + ':1720/v1',
    timeout: process.env.TIMEOUT || 5000,
});

// Generic POST request function
const post = async (url, body) => {
    const headers = {
        'I-Twilio-Auth-Account': getAccountSid(),
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

// Generic GET request function
const get = async (url, params) => {
    const headers = {
        'I-Twilio-Auth-Account': getAccountSid(),
        'T-Request-Id': 'RQ' + randomStr(32)
    }
    try {
        const response = await api.get(url, {
            headers: headers,
            params: params
        });
        const {status, data} = response;
        if (status === 200) {
            return data;
        }
    } catch (err) {
        throw new Error(err.code + " " + err.message);
    }
};

module.exports = {
    createFactor: (serviceSid, body) => post(`/Services/${serviceSid}/Factors`, body),
    verifyFactor: (serviceSid, body) => post(`/Services/${serviceSid}/Factors/Verify`, body),
    listFactors: (serviceSid, params) => get(`/Services/${serviceSid}/Factors`, params),
    getFactor: (serviceSid, sid) => get(`/Services/${serviceSid}/Factors/${sid}`),
    createChallenge: (serviceSid, body) => post(`/Services/${serviceSid}/Challenges`, body),
    verifyChallenge: (serviceSid, body) => post(`/Services/${serviceSid}/Challenges/Verify`, body),
    listChallenges: (serviceSid, params) => get(`/Services/${serviceSid}/Challenges`, params),
    getChallenge: (serviceSid, sid) => get(`/Services/${serviceSid}/Challenges/${sid}`),
};