import os
from datetime import datetime, timedelta
import pytz
from supabase import create_client, Client
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import bcrypt
import jwt
from models.Users import LoginRequest

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
    response = supabase.table("Users").insert({"email": email, "hash_password": hash_password}, count="exact").execute()
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

    return { "message": "Login successful", "token": f"Bearer {token}"}




# Helper functions
def get_token(id, email):
    sg_now = datetime.now(pytz.timezone("Asia/Singapore"))
    expiry = sg_now + timedelta(days=1)
    # generate jwt token
    token = jwt.encode({
        "email": email,
        "id": id,
        "exp": expiry
        }, secret, algorithm="HS256")

    return token