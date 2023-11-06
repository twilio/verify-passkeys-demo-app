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
            factor_type: "passkey",
            entity: {
                identity: requestBody.userMail,
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
        const data = await createFactor(serviceSid, createFactorBody);
        credentialCreationOptions = {
            publicKey: data.config.creation_request
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
    console.log("Verify Passkeys create factor call.");

    //local storage
    console.log("save to local storage: " + requestBody.userMail)
    storage.save(requestBody.userMail + "#factor#create", credentialCreationOptions);

    let factorData = {credentialCreationOptions};
    res.send(factorData);
})
// define the verify route
router.post('/verify', async (req, res) => {
    console.log("Verify Passkeys verify factor call.")

    const useMail = req.body.userMail;
    const attestation = req.body.authenticatorAttestationResponse;
    let verifyResult = {}
    try {
        const verifyFactorBody = attestation
        // invoke verify passkeys service
        const data = await verifyFactor(serviceSid, verifyFactorBody);
        verifyResult = data
    } catch (err) {
        res.status(500).send(err.message);
    }

    //local storage
    console.log("save to local storage: " + useMail)
    storage.save(useMail + "#factor#verify", verifyResult);

    res.send(verifyResult);
})

module.exports = router