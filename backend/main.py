import os
from datetime import datetime, timedelta
import pytz
from supabase import create_client, Client
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import bcrypt
import jwt
from models.Portfolios import UpdatePortfolioRequest, SetPortfolioRequest, PortfolioSuggestionsRequest, UpdateCapitalInvestedRequest
from models.Users import LoginRequest
from scripts.generate_portfolios import generate_portfolios
from fastapi.responses import JSONResponse
from collections import defaultdict

app = FastAPI()

# Allow requests from frontend
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            
    allow_credentials=True,
    allow_methods=["*"],             
    allow_headers=["*"],             
)

load_dotenv()
secret = os.getenv("JWT_SECRET")
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def validate_token(token: str = Depends(oauth2_scheme)):
    """ 
    Validate a JWT token
    """
    try:
        payload = jwt.decode(token, secret, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    

@app.post("/api/user/register")
def register(request: LoginRequest):
    # check if email already used
    email = request.email
    password = request.password
    
    response = supabase.table("Users").select("*", count="exact").eq("email", email).execute()
    if response.count > 0:
        raise HTTPException(status_code=400, detail="Email already used")
    
    # hash password using bcrypt
    hash_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    response = supabase.table("Users").insert({
        "email": email,
        "hash_password": hash_password,
        "profiled": False,
        }).execute()
    if response.count == 0:
        raise HTTPException(status_code=500, detail="Failed to create user")
    
    # generate jwt token
    token = get_token(response.data[0]["id"], email)

    return { "message": "User created successfully", "token": f"Bearer {token}"}

@app.post("/api/user/login")
def login(request: LoginRequest):
    email = request.email
    password = request.password
    
    response = supabase.table("Users").select("*", count="exact").eq("email", email).execute()
    if response.count == 0:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # check if password is correct
    if not bcrypt.checkpw(password.encode('utf-8'), response.data[0]["hash_password"].encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # generate jwt token
    token = get_token(response.data[0]["id"], email)

    return { "message": "Login successful", "token": f"Bearer {token}", "profiled": response.data[0]["profiled"]}

@app.get("/update_portfolios")
def update_portfolios():
    generate_portfolios(supabase)
    return {"message": "Portfolio updated successfully"}

@app.post("/api/portfolio_suggestions")
def portfolio_suggestions(request: PortfolioSuggestionsRequest, payload: dict = Depends(validate_token)):
    """
    Returns portfolio suggestions based on the score
    """
    # allocate the category from the score
    score = request.score
    if 0 <= score <= 20:
        category = "ultra_low"
    elif 20 < score <= 40:
        category = "low"
    elif 40 < score <= 60:
        category = "moderate"
    elif 60 < score <= 80:
        category = "high"
    else:
        category = "very_high"
    
    portfolios = {
        "suggested": [],
        "others": []
    }
    for risk_level in ["ultra_low", "low", "moderate", "high", "very_high"]:
        response = supabase.table("Portfolios").select("*", count="exact").eq("name", risk_level).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Invalid category, no portfolio suggestions found")
        if risk_level == category:
            portfolios["suggested"].append(response.data[0])
        else:
            portfolios["others"].append(response.data[0])

    return portfolios

@app.post("/api/user/set_portfolio")
def set_portfolio(response: SetPortfolioRequest, payload: dict = Depends(validate_token)):
    """
    Sets the portfolio for the user based on the id of the portfolio
    """
    portfolio_id = response.portfolio_id
    # Update the portfolio_id
    response = supabase.table("Portfolios").select("*", count="exact").eq("id", portfolio_id).execute()
    if response.count == 0:
        raise HTTPException(status_code=404, detail="Invalid portfolio id")
    
    # get user from payload and update the portfolio_id
    user_id = payload["id"]
    response = supabase.table("Users").update({"portfolio_id": portfolio_id, "profiled": True}).eq("id", user_id).execute()
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to update portfolio")
    
    return {"message": "Portfolio set successfully"}

@app.post("/api/update_portfolio")
def update_portfolio(request: UpdatePortfolioRequest):
    """
    Updates the ticket weights and asset class weights for the portfolio
    Called by the script to update the database accordingly
    """
    if datetime.now(pytz.timezone("Asia/Singapore")).day == 1:
        # rebalance the portfolio on the 1st of every month
        generate_portfolios(supabase)
        return {"message": "Portfolio rebalanced successfully"}

    response = supabase.table("Portfolios").eq("name", request.risk_level).update({
        "tickers": request.tickers,
        "asset_class_weight": request.asset_class_weight
    }).execute()
    
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to update portfolio")
    portfolio_id = response.data[0]["id"]

    # Calculate the normalised value of the portfolio
    response = supabase.table("Portfolio_Value").select("*", count="exact").eq("portfolio_id", portfolio_id).order("date", ascending=False).limit(1).execute()
    if response.count == 0:
        raise HTTPException(status_code=500, detail="Failed to get portfolio value")

    no_of_shares = response.data[0]["no_of_shares"]
    
    new_normalised_value = 0
    for ticker in request.tickers:
        # get from yfinance
        closing_price = 0
        value = no_of_shares[ticker] * closing_price
        new_normalised_value += value
    
    # update the portfolio value
    response = supabase.table("Portfolio_Value").insert({
        "portfolio_id": portfolio_id,
        "value": new_normalised_value,
        "no_of_shares": no_of_shares
    }).execute()

    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to update portfolio value")
    
    
    return {"message": "Portfolio updated successfully"}

@app.get("/api/portfolio_value_change")
def get_portfolio_value(payload: dict = Depends(validate_token)):
    user_id = payload["id"]

    # Query the "Users" table where id == user_id
    response = supabase.table("Users").select("portfolio_ids").eq("id", user_id).execute()

    # Check if the user exists and if data was returned
    if not response.data or len(response.data) == 0:
        raise HTTPException(status_code=404, detail="User not found")

    # Get the user's portfolio_ids
    portfolio_ids = response.data[0]["portfolio_ids"]

    # Create a dictionary to store the portfolio_id to change in real value of that portfolio for the user 
    portfolio_id_to_values = dict()

    for portfolio_id in portfolio_ids:

        # Get the date and amount that the user has invested
        response = supabase.table("User_Portfolio_Value").select("created_at", "capital_invested").eq("user_id", user_id).eq("portfolio_id", portfolio_id).order("created_at", desc=False).execute()
        list_of_date_and_capital = response.data

        # Convert created_at to just date (YYYY-MM-DD)
        for item in list_of_date_and_capital:
            item["created_at"] = item["created_at"].split("T")[0]

        # Get the earliest date the user invested
        first_date = list_of_date_and_capital[0]["created_at"]

        # Get all the normalised values of the portfolio after and including the date the user has invested
        response = supabase.table("Portfolio_Value").select("normalised_value", "created_at").eq("portfolio_id", portfolio_id).gte("created_at", first_date).execute()
        list_of_date_and_normalised_value = response.data

        # Convert created_at to just date (YYYY-MM-DD)
        for item in list_of_date_and_normalised_value:
            item["created_at"] = item["created_at"].split("T")[0]

        # Create a values array to track the changes in real portfolio value for the user
        values = []

        # Create a pointer to track the date at which the user has bought/sold 
        pos = 0

        # Create a variable to track the amount the normalised value must be multiplied by
        multiple = 0

        # Get the name of the Portfolio 
        response = supabase.table("Portfolios").select("name").eq("id", portfolio_id).execute()
        name = response.data[0]["name"]

        # Calculate the changes in real value for that particular portfolio
        for item in list_of_date_and_normalised_value:
            if item["created_at"] == list_of_date_and_capital[pos]["created_at"]:

                # Format the date
                date_str = item["created_at"]
                date_obj = datetime.strptime(date_str, "%Y-%m-%d")
                formatted_date = date_obj.strftime("%d %b %Y")

                values.append({"date": formatted_date, "value": list_of_date_and_capital[pos]["capital_invested"]})

                multiple = list_of_date_and_capital[pos]["capital_invested"] / float(item["normalised_value"])
                if pos < len(list_of_date_and_capital) - 1:
                    pos += 1
            else:

                # Format the date
                date_str = item["created_at"]
                date_obj = datetime.strptime(date_str, "%Y-%m-%d")
                formatted_date = date_obj.strftime("%d %b %Y")

                values.append({"date": formatted_date, "value": float(item["normalised_value"]) * multiple})
        
        # Add the list of values to the dictionary
        portfolio_id_to_values[name] = values

    # Create the dictionary that maps date to total portfolio value
    date_to_value_dict = defaultdict(int)

    # Iterate through the portfolio_id_to_values dict
    for individual_portfolio_value_list in portfolio_id_to_values.values():
        for date_and_value_dict in individual_portfolio_value_list:
            curr_date = date_and_value_dict["date"]
            curr_value = date_and_value_dict["value"]
            date_to_value_dict[curr_date] += curr_value
    
    # Create the list of dictionaries to store date and corresponding value
    total_date_and_value_list = []

    for key, value in date_to_value_dict.items():
        total_date_and_value_list.append({"date": key, "value": value})
    
    portfolio_id_to_values["total"] = total_date_and_value_list

    return JSONResponse(portfolio_id_to_values)

@app.get("/api/all_portfolios")
def get_all_portfolios(payload: dict = Depends(validate_token)):

    # Query the database to get all the portfolios available 
    response = supabase.table("Portfolios").select("*").order("id", desc=False).execute()

    # Check if data was returned
    if not response.data or len(response.data) == 0:
        raise HTTPException(status_code=404, detail="Portfolios not found")
    
    return JSONResponse(response.data)

@app.get("/api/current_holdings")
def get_current_holdings(payload:dict = Depends(validate_token)):
    user_id = payload["id"]

    # Get User's Portfolio IDs
    user_response = supabase.table("Users").select("portfolio_ids").eq("id", user_id).execute()

    if not user_response.data or not user_response.data[0]["portfolio_ids"]:
        raise HTTPException(status_code=404, detail="Portfolios not found")

    portfolio_ids = user_response.data[0]["portfolio_ids"]

    # Get Portfolio Details
    portfolio_response = supabase.table("Portfolios").select("*").in_("id", portfolio_ids).execute()

    if not portfolio_response.data:
        raise HTTPException(status_code=404, detail="Portfolios not found")
    
    portfolios = portfolio_response.data

    return JSONResponse(portfolios)

@app.get("/api/current_holdings_value")
def get_current_holdings(payload:dict = Depends(validate_token)):
    user_id = payload["id"]

    # Get User's Portfolio IDs
    user_response = supabase.table("Users").select("portfolio_ids").eq("id", user_id).execute()

    if not user_response.data or not user_response.data[0]["portfolio_ids"]:
        raise HTTPException(status_code=404, detail="Portfolios not found")

    portfolio_ids = user_response.data[0]["portfolio_ids"]

    # Get Portfolio Details
    list_of_portfolio_dicts = []

    for portfolio_id in portfolio_ids:
        portfolio_response = supabase.table("User_Portfolio_Value").select("capital_invested", "portfolio_id", "created_at").eq("user_id", user_id).eq("portfolio_id", portfolio_id).order("created_at", desc=True).limit(1).execute()
        if not portfolio_response.data:
            raise HTTPException(status_code=404, detail="Portfolios not found")
        list_of_portfolio_dicts.append(portfolio_response.data[0])
    
    # Convert created_at to just date (YYYY-MM-DD)
        for portfolio in list_of_portfolio_dicts:
            portfolio["created_at"] = portfolio["created_at"].split("T")[0]

    portfolio_id_to_current_value_dict = defaultdict(float)
    
    for portfolio in list_of_portfolio_dicts:
        normalised_value_response = supabase.table("Portfolio_Value").select("normalised_value").eq("portfolio_id", portfolio["portfolio_id"]).eq("created_at", portfolio["created_at"]).execute()
        multiple =  portfolio["capital_invested"] / normalised_value_response.data[0]["normalised_value"]
        current_value_response = supabase.table("Portfolio_Value").select("normalised_value").eq("portfolio_id", portfolio["portfolio_id"]).order("created_at", desc=True).limit(1).execute()
        current_value = multiple * current_value_response.data[0]["normalised_value"]
        portfolio_id_to_current_value_dict[portfolio["portfolio_id"]] = current_value
    
    return JSONResponse(portfolio_id_to_current_value_dict)

@app.post("/api/update_capital_invested")
def update_capital_invested(body: UpdateCapitalInvestedRequest, payload: dict = Depends(validate_token)):
    capital = body.capital
    portfolio_id = body.portfolio_id
    user_id = payload["id"]

    # update the capital invested
    response = supabase.table("User_Portfolio_Value").insert({
        "user_id": user_id,
        "portfolio_id": portfolio_id,
        "capital_invested": capital
    }).execute()

    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to update capital invested")
    
    # update the portfolio_ids in "Users" table
    response = supabase.table("Users").select("portfolio_ids").eq("id", user_id).execute()

    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to retrieve users table")
    
    portfolio_ids = response.data[0]["portfolio_ids"]

    if portfolio_id not in portfolio_ids:
        portfolio_ids.append(portfolio_id)
        response = supabase.table("Users").update({"portfolio_ids": portfolio_ids}).eq("id", user_id).execute()

    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to update users table")
    
    return {"message": "Portfolio updated successfully"}

# ------------------------------------------------------------Testing--------------------------------------------------------------------
@app.get("/api/get_user_portfolio_value_table")
def get_user_portfolio_value_table():
    response = supabase.table("User_Portfolio_Value").select("*").execute()
    return JSONResponse(response.data)

@app.delete("/api/delete_user_portfolio_values")
def delete_user_portfolio_values():
    response = supabase.table("User_Portfolio_Value").delete().gt("id", 14).execute()

    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to delete rows")

    return {"message": "Rows deleted successfully"}

@app.get("/api/get_user_info")
def get_user_info(payload: dict = Depends(validate_token)):
    user_id = payload["id"]
    
    response = supabase.table("Users").select("*").eq("id", user_id).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="User not found")

    return JSONResponse(content=response.data[0])

@app.post("/api/edit_the_portfolio_array")
def delete_user_portfolio_values(payload: dict = Depends(validate_token)):
    user_id = payload["id"]
    
    response = supabase.table("Users").update({"portfolio_ids": [1, 5]}).eq("id", user_id).execute()

    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to update portfolio array")

    return {"message": "Portfolio Array Updated Successfully"}

@app.get("/api/portfolio_value")
def get_all_portfolio_values():
    response = supabase.table("Portfolio_Value").select("*").execute()
    
    if not response.data:
        return JSONResponse(status_code=500, content={"error": response.error.message})

    return JSONResponse(response.data)



# Helper functions
def get_token(id, email):
    """
    Generate a JWT token for the user
    """
    sg_now = datetime.now(pytz.timezone("Asia/Singapore"))
    expiry = sg_now + timedelta(days=1)
    # generate jwt token
    token = jwt.encode({
        "email": email,
        "id": id,
        "exp": expiry
        }, secret, algorithm="HS256")

    return token