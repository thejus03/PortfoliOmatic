import axios from "axios";

const baseClient = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
    headers: {
        "Content-Type": "application/json",
    }
});

export const getChartData = async (token) => {
    try {
        const response = await baseClient.get("/portfolio_value_change", {
            headers: {
                Authorization: token,
            }
        });
        return response.data["total"] || [];
    } catch (error) {
        console.error("Error fetching chart data:", error);
        return [];
    }
};

export const getPortfolioSuggestions = async (score, token) => {
    try {
        const response = await baseClient.post("/portfolio_suggestions", {
            score
        }, {
            headers: {
                Authorization: token,
            }
        });
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.detail || "Failed to fetch portfolio suggestions"
        };
    }
};

export const setUserPortfolio = async (portfolioId, token) => {
    try {
        const response = await baseClient.post("/user/set_portfolio", {
            portfolio_id: portfolioId
        }, {
            headers: {
                Authorization: token,
            }
        });
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.detail || "Failed to set portfolio"
        };
    }
};

export const updatePortfolio = async (riskLevel, tickers, assetClassWeight) => {
    try {
        const response = await baseClient.post("/update_portfolio", {
            risk_level: riskLevel,
            tickers,
            asset_class_weight: assetClassWeight
        });
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.detail || "Failed to update portfolio"
        };
    }
}; 

export const getAllPortfolios = async (token) => {
    try {
        const response = await baseClient.get("all_portfolios", {
            headers: {
                Authorization: token
            }
        });

        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.detail || "Failed to update portfolio"
        };
    }
}

export const getHoldingPortfolios = async (token) => {
    try {
        const response = await baseClient.get("current_holdings", {
            headers: {
                Authorization: token
            }
        });

        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.detail || "Failed to update portfolio"
        };
    }
}

export const getUserPortfolioValue = async (token) => {
    try {
        const response = await baseClient.get("current_holdings_value", {
            headers: {
                Authorization: token
            }
        });

        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.detail || "Failed to update portfolio"
        };
    }
}

export const updateCapitalInvested = async (token, newCapital, buyPortfolioId) => {
    try {
        const response = await baseClient.post("update_capital_invested", {
            capital: newCapital,
            portfolio_id: buyPortfolioId
        }, {
            headers: {
                Authorization: token
            }
        });

        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.detail || "Failed to update portfolio"
        };
    }
}