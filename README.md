# PortfoliOmatic

## **A Smart Robo-Advisory Platform for Personalised Portfolio Management**
##### Developed by [Thejus Unnikrishnan](https://github.com/thejus03) and [Samuel Christy George](https://github.com/samuelcg20) for **NUS Orbital 2025**

---

## 🌐 Live Demo

Visit the live app at: **[http://47.129.100.127:3000/](http://47.129.100.127:3000/)**

Use the test account for full feature exploration:

* **Email**: [test@gmail.com](mailto:test@gmail.com)
* **Password**: Foobar123!

(*Please do not delete this test account. Log out after use.*)

---

## 📌 Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Architecture](#architecture)
* [Tech Stack](#tech-stack)
* [Financial Models](#financial-models)
* [Testing & Quality Assurance](#testing--quality-assurance)
* [Local Deployment](#local-deployment)

---

## Overview

PortfoliOmatic bridges the gap between advanced portfolio theory and retail investor accessibility. It offers retail users an intuitive platform to:

* Identify their risk tolerance
* Receive tailored portfolio recommendations
* Simulate and track investment growth through a robust paper-trading system

Inspired by leading platforms like **Syfe** and **StashAway**, PortfoliOmatic is built from the ground up to showcase backend financial logic, real-time tracking, and scalable full-stack engineering.

---

## 🚀 Features

### Authentication & User Management

* Secure sign-up/login using email and password
* Custom JWT token-based session management

### Risk Assessment

* 3-part questionnaire: Risk preference, Financial background, Behavioral reactions
* Dynamic scoring system mapped to 5 risk levels

### Portfolio Recommendation & Simulation

* Users assigned portfolios based on risk level:

  * Ultra Low Risk: Capital Preservation Portfolio
  * Low Risk: Conservative Income Portfolio
  * Moderate Risk: Balanced Growth Portfolio
  * High Risk: Growth-Oriented Portfolio
  * Very High Risk: Aggressive Growth Portfolio
* Users can invest in multiple portfolios simultaneously

### Advanced Portfolio Generation

* Assets curated using YAML definitions ([`assets/`](https://github.com/thejus03/PortfoliOmatic/blob/main/backend/assets/))
* Weights computed using:

  * **Black-Litterman Model** (for expected returns)
  * **Mean-Variance Optimisation** (for optimal weights)
* Efficient Frontier & Sharpe Ratio computations

### Monthly Rebalancing

* Auto-adjust portfolios based on monthly market data via cron jobs
* Reinvestment logic keeps value trajectory intact

### Real-time Portfolio Tracking

* Value updates based on live price data via cron jobs

### Buy & Sell Simulation

* Buy portfolios via investment tickets
* Partial sell or full liquidation supported

### Visualisations

* Cumulative Portfolio Value & Performance Graphs
* Individual Portfolio Charts
* Pie chart breakdown by asset class & composition

---

## Architecture

### Backend

* **FastAPI** handles RESTful endpoints
* Authentication, portfolio logic, data caching and simulations

### Frontend

* **Next.js** (React-based framework)
* UI via **ChakraUI** and **TailwindCSS**
* Dynamic graphs rendered using **Recharts**

### Database

* Hosted on **Supabase (PostgreSQL)**
* Core tables:

  * `Users`
  * `Portfolios`
  * `Portfolio_Value`
  * `User_Portfolio_Value`

### Financial Data Pipeline

* Asset data from **yfinance**
* Risk/return modeling via **PyPortfolioOpt**
* Matrix operations with **numpy**

---

## Financial Models

### Black-Litterman Model

Combines:

* Market-implied equilibrium returns
* Analyst forward-looking views

### Mean-Variance Optimisation

Uses:

* Adjusted returns from BLM
* Covariance matrix
  To produce:
* Efficient frontier
* Maximum Sharpe Ratio portfolios

### Portfolio Value Computation

* Normalised base portfolio (\$1000)
* Daily updated via cron jobs
* User-specific scaling of master portfolio

---

## Testing & Quality Assurance

### Unit Testing

* RoboAdvisor & Portfolio class logic tested
* Mocked financial data using `monkeypatch`, `MagicMock`

### End-to-End Testing

* Simulated flows:

  * Registration
  * Risk Profiling
  * Portfolio Selection
  * Buy/Sell simulation
* Framework used: **Playwright**

---

## 🛠 Tech Stack

### Frontend

* **Next.js**, **ChakraUI**, **TailwindCSS**

### Backend

* **FastAPI**, **Python**, **Supabase** (PostgreSQL)

### Financial Libraries

* `yfinance`, `PyPortfolioOpt`, `numpy`

### Testing

* `pytest`, `monkeypatch`, `MagicMock`, `Playwright`

### DevOps

* **GitHub** for collaboration & version control

### Deployment
* **AWS EC2** for hosting the application

---

## 📄 Documentation & Resources

* Full Report: [View Report](https://drive.google.com/file/d/1MZyRyT_NyJfcqDNAzq8wlFd7nXXi8pZf/view?usp=sharing)
* Demo Video: [View Demo](https://drive.google.com/file/d/1hziW6bqns1JMLTCkvfaP1qc-6iAdHSbl/view?usp=sharing)

---

## Local Deployment

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
4. Create a `.env` file in the root `PortfoliOmatic` directory with the following variable
```
NEXT_PUBLIC_FINNHUB_TOKEN='your_finnhub_token'
```

5. Install frontend dependencies
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

---
> This project is an **educational proof-of-concept** that explores:
> - how modern portfolio theory can be implemented
> - how to translate user risk profiling into algorithmic decision making
> - how a scalable and versatile platform can be built to support personalised portfolio generation