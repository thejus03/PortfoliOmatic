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
from models.Portfolios import UpdatePortfolioRequest, SetPortfolioRequest, PortfolioSuggestionsRequest
from models.Users import LoginRequest
from scripts.generate_portfolios import generate_portfolios

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