"use client"
import { createContext, useContext, useState } from "react";

const AccountSetupContext = createContext();

export const AccountSetupProvider = ({ children }) => {
    const [formData, setFormData] = useState({
        riskPreference : {
            risk: "balanced",
        },
        background: {
            timeHorizon: "less-than-1-year",
            incomeLevel: "less-than-40000",
            monthlyExpense: "less-than-15",
            investmentPercentage: "less-than-15"
        },
        behavioural: {
            selectedOption: "sell",
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