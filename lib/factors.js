const express = require('express')
const router = express.Router()

const config = require('./config')
const storage = require('./storage')
const {createFactor, verifyFactor} = require('./verify-passkeys-service');
const {randomStr} = require("./utils");

const serviceSid = process.env.SERVICE_SID || "VA123456789012345678901234567890bb";

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
        const factorCreation = await createFactor(serviceSid, createFactorBody);
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
        const verifyFactorBody = attestation
        // invoke verify passkeys service
        const verifyResult = await verifyFactor(serviceSid, verifyFactorBody);

        //local storage
        console.log("save to local storage: " + userName)
        storage.save(userName + "#factor#verify", verifyResult);

        res.send(verifyResult);
    } catch (err) {
        res.status(500).send(err.message);
    }

})

module.exports = router