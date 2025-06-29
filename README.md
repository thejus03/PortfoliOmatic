# PortfoliOmatic

### Installation

1. Clone the repository
   ```
   git clone https://github.com/thejus03/PortfoliOmatic.git
   cd PortfoliOmatic
   ```

2. Set up the backend
   ```
   cd backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the backend directory with your Supabase credentials and a JWT Secret
   ```
   SUPABASE_URL=`your_supabase_url`
   SUPABASE_KEY=`your_supabase_key`
   JWT_SECRET=`your_jwt_secret`
   ```

4. Install frontend dependencies
   ```
   cd ..
   npm install
   ```

### Running the Application

1. Start the backend server
   ```
   cd backend
   uvicorn main:app --reload
   ```

2. In a separate terminal, start the frontend
   ```
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`
4. Backend is running on `http://localhost:8000`
5. APIs are available at `http://localhost:8000/docs`