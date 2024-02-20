require('dotenv').config();
const axios = require('axios');
const {getAccountSid, getAccountAuthToken} = require('./config');

// Axios Client declaration
const api = axios.create({
    baseURL: 'https://preview-verify.twilio.com/v1',
    timeout: 5000
});

// Generic POST request function
const post = async (url, body) => {
    try {
        console.log("acc sid " + getAccountSid());
        console.log("auth " + getAccountAuthToken());
        const response = await api.post(url, body, {
            auth: {
                username: getAccountSid(),
                password: getAccountAuthToken()
            }
        });
        const {status, data} = response;
        if (status === 201 || status === 200) {
            return data;
        }
    } catch (err) {
        console.log(err);
        throw new Error(err.code + " " + err.message);
    }
};

// Generic GET request function
const get = async (url, params) => {
    try {
        const response = await api.get(url, {
            params: params,
            auth: {
                username: getAccountSid(),
                password: getAccountAuthToken()
            }
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