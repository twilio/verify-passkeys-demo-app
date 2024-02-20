const express = require('express')
const router = express.Router()

const config = require('./config')
const storage = require('./storage')
const {createFactor, verifyFactor, listFactors, getFactor} = require('./verify-passkeys-service');

// middleware that is specific to this router
router.use((req, res, next) => {
    next()
})
// define the register route
router.post('/create', async (req, res, next) => {
    const requestBody = req.body;
    let credentialCreationOptions = {publicKey: {}}
    try {
        const createFactorBody = {
            friendly_name: "ACME-ID",
            factor_type: "passkeys",
            entity: {
                identity: requestBody.userName,
                display_name: requestBody.userFriendlyName
            },
            config: {
                relying_party: {
                    id: 'localhost',
                    name: "ACME Corporation",
                    origins: [
                        config.getUrl()
                    ]
                },
                authenticator_criteria: {
                    authenticator_attachment: requestBody.authenticatorAttachment,
                    discoverable_credentials: requestBody.userVerification,
                    user_verification: requestBody.userVerification
                }
            }
        }
        // invoke verify passkeys service
        console.log(`[${new Date().toLocaleString()}][Twilio API] Verify Passkeys create factor request`);
        const factorCreation = await createFactor(config.getServiceSid(), createFactorBody);
        credentialCreationOptions = {
            publicKey: factorCreation.config.creation_request
        }
        console.log(`[${new Date().toLocaleString()}][Twilio API] Verify Passkeys create factor response`);
        console.log(factorCreation);

        //local storage
        console.log(`[${new Date().toLocaleString()}][Server] save to local storage: ${requestBody.userName}`);
        storage.save(requestBody.userName + "#factor#create", factorCreation);
        storage.save(requestBody.userName + "#factor#creationOptions", credentialCreationOptions);

        let factorData = {credentialCreationOptions};
        res.send(factorData);

    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
})
// define the verify route
router.post('/verify', async (req, res) => {
    console.log(`[${new Date().toLocaleString()}][Twilio API] Verify Passkeys factor verification request`);

    const userName = req.body.userName;
    const attestation = req.body.authenticatorAttestationResponse;
    try {
        // invoke verify passkeys service
        const verifyResult = await verifyFactor(config.getServiceSid(), attestation);
        console.log(`[${new Date().toLocaleString()}][Twilio API] Verify Passkeys factor verification response`);
        console.log(verifyResult);

        //local storage
        console.log(`[${new Date().toLocaleString()}][Server] save to local storage: ${userName}`);
        storage.save(userName + "#factor#verify", verifyResult);

        res.send(verifyResult);
    } catch (err) {
        res.status(500).send(err.message);
    }

})

// define the list route
router.get('/list', async (req, res) => {
    const params = req.query;
    try {
        console.log(`[${new Date().toLocaleString()}][Twilio API] Verify Passkeys list factors request`);
        // invoke verify passkeys service
        const listResult = await listFactors(config.getServiceSid(), params);
        console.log(`[${new Date().toLocaleString()}][Twilio API] Verify Passkeys list factors response`);
        console.log(listResult);

        res.send(listResult);
    } catch (err) {
        res.status(500).send(err.message);
    }
})

// define the list route
router.get('/:sid', async (req, res) => {
    console.log(`[${new Date().toLocaleString()}][Twilio API] Verify Passkeys get factor request`);
    const sid = req.params.sid;
    try {
        // invoke verify passkeys service
        const getResult = await getFactor(config.getServiceSid(), sid);
        console.log(`[${new Date().toLocaleString()}][Twilio API] Verify Passkeys get factor response`);
        console.log(getResult);

        res.send(getResult);
    } catch (err) {
        res.status(500).send(err.message);
    }
})

module.exports = router