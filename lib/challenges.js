const express = require('express')
const router = express.Router()

const config = require('./config')
const storage = require('./storage')
const {createChallenge} = require('./verify-passkeys-service');
const {verifyChallenge} = require('./verify-passkeys-service');
const {randomStr} = require("./utils");

const serviceSid = process.env.SERVICE_SID || "VA123456789012345678901234567890bb";

// middleware that is specific to this router
router.use((req, res, next) => {
    console.log('Challenges Time: %s', Date.now())
    next()
})
// define the register route
router.post('/create', async (req, res, next) => {
    console.log("Verify Passkeys create challenges call.")
    const requestBody = req.body;

    const factorCreation = storage.get(requestBody.userName + "#factor#create");
    const factorSid = factorCreation ? factorCreation.sid : null;
    const entitySid = factorCreation ? factorCreation.entity_sid : null;
    let entity = null;  // TODO fix bug with null entity  attributes
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
        const challengeCreation = await createChallenge(serviceSid, createChallengeBody);
        const credentialRequestOptions = {
            publicKey: challengeCreation.details.publicKey
        }

        //local storage
        console.log("save challenge to local storage: " + requestBody.userName)
        storage.save(requestBody.userName + "#challenge#create", challengeCreation);

        let challengeData = {credentialRequestOptions}
        res.send(challengeData);

    } catch (err) {
        res.status(500).send(err.message);
    }

})
// define the verify route
router.post('/verify', async (req, res) => {
    console.log("Verify Passkeys verify challenges call.")

    const requestBody = req.body;
    try {
        const verifyChallengeBody = requestBody.authenticatorAttestationResponse;
        // invoke verify passkeys service
        const challengeVerify = await verifyChallenge(serviceSid, verifyChallengeBody);

        //local storage
        console.log("save challenge to local storage: " + requestBody.userName)
        storage.save(requestBody.userName + "#challenge#verify", challengeVerify);

        let challengeData = {challengeVerify}
        res.send(challengeData);

    } catch (err) {
        res.status(500).send(err.message);
    }
})

module.exports = router