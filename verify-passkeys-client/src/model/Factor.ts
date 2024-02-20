interface Binding {
    authenticator_metadata: null | string;
    credential_id: null | string;
    credential_public_key: null | string;
    flags: null | string;
    transports: null | string;
}

interface AuthenticatorCriteria {
    authenticator_attachment: string;
    discoverable_credentials: string;
    user_verification: string;
}

interface Rp {
    id: string;
    name: string;
}

interface User {
    displayName: null | string;
    id: string;
    name: string;
}

interface PubKeyCredParam {
    alg: number;
    type: string;
}

interface CreationRequest {
    attestation: string;
    authenticatorSelection: AuthenticatorCriteria;
    challenge: string;
    excludeCredentials: any[];
    pubKeyCredParams: PubKeyCredParam[];
    rp: Rp;
    timeout: number;
    user: User;
}

interface RelyingParty {
    id: string;
    name: string;
    origins: string[];
}

interface Config {
    authenticator_criteria: AuthenticatorCriteria;
    creation_request: CreationRequest;
    relying_party: RelyingParty;
}

export interface Factor {
    account_sid: string;
    binding: Binding;
    config: Config;
    date_created: string;
    date_updated: string;
    entity_identity: string;
    entity_sid: string;
    factor_type: string;
    friendly_name: string;
    service_sid: string;
    sid: string;
    status: string;
}