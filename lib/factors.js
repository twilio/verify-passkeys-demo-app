const express = require('express')
const router = express.Router()

const config = require('./config')
const storage = require('./storage')
const {createFactor, verifyFactor, listFactors, getFactor} = require('./verify-passkeys-service');

// middleware that is specific to this router
router.use((req, res, next) => {
    console.log('Factor Time: %s url: %s', Date.now(), config.getUrl())
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
                    id: config.getHostName(),
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
        console.log("Verify Passkeys create factor call.");
        const factorCreation = await createFactor(config.getServiceSid(), createFactorBody);
        credentialCreationOptions = {
            publicKey: factorCreation.config.creation_request
        }

        //local storage
        console.log("save to local storage: " + requestBody.userName)
        storage.save(requestBody.userName + "#factor#create", factorCreation);
        storage.save(requestBody.userName + "#factor#creationOptions", credentialCreationOptions);

        let factorData = {credentialCreationOptions};
        res.send(factorData);

    } catch (err) {
        res.status(500).send(err.message);
    }
})
// define the verify route
router.post('/verify', async (req, res) => {
    console.log("Verify Passkeys verify factor call.")

    const userName = req.body.userName;
    const attestation = req.body.authenticatorAttestationResponse;
    try {
        // invoke verify passkeys service
        const verifyResult = await verifyFactor(config.getServiceSid(), attestation);

        //local storage
        console.log("save to local storage: " + userName)
        storage.save(userName + "#factor#verify", verifyResult);

        res.send(verifyResult);
    } catch (err) {
        res.status(500).send(err.message);
    }

})

// define the list route
router.get('/list', async (req, res) => {
    console.log("Verify Passkeys list factors call.")
    const params = req.query;
    try {
        // invoke verify passkeys service
        const listResult = await listFactors(config.getServiceSid(), params);
        res.send(listResult);
    } catch (err) {
        res.status(500).send(err.message);
    }
})

// define the list route
router.get('/:sid', async (req, res) => {
    console.log("Verify Passkeys get factor call.")
    const sid = req.params.sid;
    try {
        // invoke verify passkeys service
        const getResult = await getFactor(config.getServiceSid(), sid);
        res.send(getResult);
    } catch (err) {
        res.status(500).send(err.message);
    }
})

module.exports = router