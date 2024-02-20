import {
    create,
    get,
    parseCreationOptionsFromJSON,
    parseRequestOptionsFromJSON
} from "@github/webauthn-json/browser-ponyfill";
import RegistrationForm from "../model/RegistrationForm";
import {ApiService} from "./ApiService";


const createKey = async (publicKey: any) => {
    if (!window.PublicKeyCredential) { /* Client not capable. Handle error. */
        throw new Error('PublicKeyCredential is not supported.');
    }
    console.log("[Client] createKey request");
    console.log(JSON.stringify(publicKey, null, 2))
    const credentialCreationOptions = parseCreationOptionsFromJSON(publicKey);
    console.log("Parsed success")
    let result = await create(credentialCreationOptions);
    console.log("[Client] createKey response");
    console.log(JSON.stringify(result, null, 2));
    return result;
}

const getKey = (publicKey: any) => {
    if (!window.PublicKeyCredential) { /* Client not capable. Handle error. */
        throw new Error('PublicKeyCredential is not supported.');
    }
    console.log("[Client] getKey request");
    console.log(JSON.stringify(publicKey, null, 2))
    const credentialRequestOptions = parseRequestOptionsFromJSON(publicKey);
    return get(credentialRequestOptions).then(result => {
        console.log("[Client] getKey response");
        console.log(JSON.stringify(result, null, 2));
        return result;
    });
}

export abstract class FactorService {
    static async createFactor(registrationForm: RegistrationForm): Promise<any | null> {
        ApiService.createFactor(registrationForm).then((factorData) => {
            console.log(factorData);
            return createKey(factorData.credentialCreationOptions)
        }).then((authenticatorAttestationResponse) => {
            let userName = registrationForm.userName;
            let verifyBody = {userName, authenticatorAttestationResponse}
            return ApiService.verifyFactor(verifyBody);
        }).then((factorVerifyResponse) => {
            return {'credentials': JSON.stringify(factorVerifyResponse, null, 2)};
        }).catch((error) => {
            console.log(error);
            //showError(error);
        });
    }
}
