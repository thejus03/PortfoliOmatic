"use client"
import { createContext, useContext, useState } from "react";

const AccountSetupContext = createContext();

export const AccountSetupProvider = ({ children }) => {
    const [formData, setFormData] = useState({
        riskPreference : {
            risk: "balanced",
        },
        background: -1,
        behavioural: {
            selectedOption: "nothing",
            selectedOption2: "portfolio1",
            selectedOption3: "take-profit"
        }
    });

    return (
        <AccountSetupContext.Provider value={{ formData, setFormData }}>
            {children}
        </AccountSetupContext.Provider>
    )
}

export const useAccountSetup = () => useContext(AccountSetupContext);