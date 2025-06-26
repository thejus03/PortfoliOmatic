"use client"
import { createContext, useContext, useState } from "react";

const AccountSetupContext = createContext();

export const AccountSetupProvider = ({ children }) => {
    const [formData, setFormData] = useState({
        riskPreference : {
            risk: 0
        },
        background: {
            timeHorizon: 0,
            incomeLevel: 0,
            monthlyExpense: 0,
            investmentPercentage: 0
        },
        behavioural: {
            selectedOption: 0,
            selectedOption2: 0,
            selectedOption3: 0
        }
    });

    return (
        <AccountSetupContext.Provider value={{ formData, setFormData }}>
            {children}
        </AccountSetupContext.Provider>
    )
}

export const useAccountSetup = () => useContext(AccountSetupContext);