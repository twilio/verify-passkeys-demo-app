import {createContext} from "react";

export interface AppContext {
    accountSid: string | null;
    authToken: string | null;
    serviceSid: string | null;
    setCredentials: (accountSid: string, authToken: string, serviceSid: string) => void;
}

export const AppContextInitialState: AppContext = {
    accountSid: null,
    authToken: null,
    serviceSid: null,
    setCredentials: () => {}
}

export const AppContext = createContext<AppContext>(AppContextInitialState);