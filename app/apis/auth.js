import axios from "axios";

const baseClient = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
    headers: {
        "Content-Type": "application/json",
    }
});

export const login = async (email, password) => {
    try {
        const response = await baseClient.post("/user/login", {
            email,
            password
        });
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.detail || "Login failed"
        };
    }
};

export const register = async (email, password) => {
    try {
        const response = await baseClient.post("/user/register", {
            email,
            password
        });
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.detail || "Registration failed"
        };
    }
}; 

export const userPortfolioExists = async (token) => {
    try {
        const response = await baseClient.get("/user/portfolio/exists", {
            headers: {
                "Authorization": token
            }
        });
        return response.data;
    } catch (error) {
        return false;
    }
}