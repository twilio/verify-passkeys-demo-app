require('dotenv').config();
const axios = require('axios');
//const {config} = require("dotenv");
const {randomStr} = require('./utils')

// Axios Client declaration
const api = axios.create({
    baseURL: 'http://localhost:1720/v1',
    timeout: process.env.TIMEOUT || 5000,
});

// Generic POST request function
const post = async (url) => {
    const headers = {
        'I-Twilio-Auth-Account': 'AC' + randomStr(32),
        'T-Request-Id': 'RQ' + randomStr(32)
    }
    try {
        const response = await api.post(url, {}, {
            headers: headers
        });
        const {status, data} = response;
        if (status === 201) {
            return data;
        }
    } catch (err) {
        throw new Error(err.code + " " + err.message);
    }
};

module.exports = {
    createFactor: (serviceSid) => post(`/Services/${serviceSid}/Factors`),
};