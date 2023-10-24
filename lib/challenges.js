const express = require('express')
const router = express.Router()

const config = require('./config')
const storage = require('./storage')
const {createChallenge, listChallenges, getChallenge} = require('./verify-passkeys-service');
const {verifyChallenge} = require('./verify-passkeys-service');

// middleware that is specific to this router
router.use((req, res, next) => {
    next()
})
// define the register route
router.post('/create', async (req, res, next) => {
    console.log(`[${new Date().toLocaleString()}][Twilio API] Verify Passkeys create challenges request`);
    const requestBody = req.body;

    const factorCreation = storage.get(requestBody.userName + "#factor#create");
    const factorSid = factorCreation ? factorCreation.sid : null;
    const entitySid = factorCreation ? factorCreation.entity_sid : null;
    let entity = null;  // TODO fix bug with null entity attributes
    if (entitySid || requestBody.userName) {
        entity = {
            sid: entitySid,
            identity: requestBody.userName,
            display_name: requestBody.userFriendlyName,
        }
    }
    try {
        const createChallengeBody = {
            factor_sid: factorSid,
            entity: entity,
            details: {
                rpId: config.getHostName(),
                userVerification: requestBody.userVerification
            }
        }
        // invoke verify passkeys service
        const challengeCreation = await createChallenge(config.getServiceSid(), createChallengeBody);
        console.log(`[${new Date().toLocaleString()}][Twilio API] Verify Passkeys create challenges response`);
        console.log(challengeCreation);

        const credentialRequestOptions = {
            publicKey: challengeCreation.details.publicKey
        }

        //local storage
        console.log(`[${new Date().toLocaleString()}][Server] save challenge to local storage: ${requestBody.userName}`);
        storage.save(requestBody.userName + "#challenge#create", challengeCreation);

        let challengeData = {credentialRequestOptions}
        res.send(challengeData);

    } catch (err) {
        res.status(500).send(err.message);
    }

})

// define the verify route
router.post('/verify', async (req, res) => {
    console.log(`[${new Date().toLocaleString()}][Twilio API] Verify Passkeys verify challenge request`);

    const requestBody = req.body;
    console.log(`[${new Date().toLocaleString()}][Server] verify challenge request body`);
    console.log(requestBody);
    try {
        const verifyChallengeBody = requestBody.authenticatorAttestationResponse;
        // invoke verify passkeys service
        const challengeVerify = await verifyChallenge(config.getServiceSid(), verifyChallengeBody);
        console.log(`[${new Date().toLocaleString()}][Twilio API] Verify Passkeys verify challenge response`);
        console.log(challengeVerify);

        //local storage
        console.log(`[${new Date().toLocaleString()}][Server] save challenge to local storage: ${requestBody.userName}`);
        storage.save(requestBody.userName + "#challenge#verify", challengeVerify);

        let challengeData = {challengeVerify}
        res.send(challengeData);

    } catch (err) {
        res.status(500).send(err.message);
    }
})

// define the list route
router.get('/list', async (req, res) => {
    console.log(`[${new Date().toLocaleString()}][Twilio API] Verify Passkeys list challenges request`);
    const params = req.query;
    try {
        // invoke verify passkeys service
        const listResult = await listChallenges(config.getServiceSid(), params);
        console.log(`[${new Date().toLocaleString()}][Twilio API] Verify Passkeys list challenges response`);
        console.log(listResult);

        res.send(listResult);
    } catch (err) {
        res.status(500).send(err.message);
    }
})

// define the list route
router.get('/:sid', async (req, res) => {
    console.log(`[${new Date().toLocaleString()}][Twilio API] Verify Passkeys get challenge request`);
    const sid = req.params.sid;
    try {
        // invoke verify passkeys service
        const getResult = await getChallenge(config.getServiceSid(), sid);
        console.log(`[${new Date().toLocaleString()}][Twilio API] Verify Passkeys get challenge response`);
        console.log(getResult);

        res.send(getResult);
    } catch (err) {
        res.status(500).send(err.message);
    }
})

module.exports = router