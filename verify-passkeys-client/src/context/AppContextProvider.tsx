import {ReactNode, useState} from "react";
import {AppContext, AppContextInitialState} from "./AppContext";

interface Properties {
    children: ReactNode;
}
export default function AppContextProvider(properties: Properties) {
    const [appState, setAppState] = useState(AppContextInitialState);

    const setCredentials = (accountSid: string, authToken: string, serviceSid: string) => {
        setAppState({
            ...appState,
            accountSid: accountSid,
            authToken: authToken,
            serviceSid: serviceSid
        });
    }

    return (
        <AppContext.Provider value={{
            accountSid: appState.accountSid,
            authToken: appState.authToken,
            serviceSid: appState.serviceSid,
            setCredentials: setCredentials
        }}>
            {properties.children}
        </AppContext.Provider>
    );
}