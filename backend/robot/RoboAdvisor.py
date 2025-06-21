import yaml
import yfinance as yf
import pandas as pd
import numpy as np
from pypfopt import risk_models, expected_returns, black_litterman, EfficientFrontier
from .Portfolio import Portfolio
import os

class RoboAdvisor:
    def __init__(self, risk_level: str):
       # risk level: ultra_low, low, moderate, high, very_high
       self.risk_level = risk_level
       self.assets = self._get_assets()

    def _get_assets(self) -> list[str]:
        # Get absolute path of the current file (RoboAdvisor.py)
        base_dir = os.path.dirname(__file__)
        
        # Go up one directory (from 'robot' to 'backend')
        backend_dir = os.path.abspath(os.path.join(base_dir, ".."))
        
        # Build full path to the YAML file
        file_path = os.path.join(backend_dir, "assets", f"{self.risk_level}.yaml")

        with open(file_path, "r") as f:
            data = yaml.safe_load(f)
        return data["tickers"]

    # Method to get daily adjusted closing price of assets
    def _get_historical_prices(self):
        return yf.download(self.assets, period="5y")["Close"]
    
    # Method to get covariance of all assets
    def _get_covariance_matrix(self):
        return risk_models.sample_cov(self._get_historical_prices())
    
    # Method to get market cap of assets
    def _get_market_caps(self):
        market_caps = {}
        for ticker in self.assets:
            market_caps[ticker] = yf.Ticker(ticker).info.get("marketCap")
        return market_caps
    
    # Method to reverse engineer expected returns from market cap of assets
    def _get_implied_returns(self):
        return black_litterman.market_implied_prior_returns(
            market_caps=self._get_market_caps(),
            risk_aversion=1,
            cov_matrix=self._get_covariance_matrix()
        )
    
    # Method to get historical returns
    def _get_historical_returns(self):
        prices = self._get_historical_prices()
        daily_returns = prices.pct_change().dropna()

        # Calculate geometric annual return for each asset
        compounded_growth = (1 + daily_returns).prod()
        n_days = daily_returns.shape[0]
        
        annual_returns = compounded_growth ** (252 / n_days) - 1
        return annual_returns

    # Method to get Pick and View Matrices
    def _get_P_and_Q(self):
        # To get Q
        Q = []

        for ticker in self.assets:
            target = yf.Ticker(ticker).info.get("targetMeanPrice")
            current = yf.Ticker(ticker).info.get("currentPrice")
            if target is None or current is None:
                expected_return = 0  
            else:
                expected_return = (target - current) / current  
            Q.append(expected_return)
        
        Q = np.array(Q)

        # To get P
        P = pd.DataFrame(columns=self.assets)

        for i in range(len(self.assets)):
            row = [0] * len(self.assets)
            if Q[i] != 0:
                row[i] = 1
            P.loc[len(P)] = row
        
        return P, Q

    # Method to generate the portfolio
    def generate_portfolio(self):

        # Convert all types to floats
        cov_matrix = self._get_covariance_matrix().astype(float)
        pi = np.array(self._get_historical_returns(), dtype=float)
        P, Q = self._get_P_and_Q()
        P = P.astype(float)
        Q = np.array(Q, dtype=float)

        # Generate the blacklitterman model
        bl = black_litterman.BlackLittermanModel(
            cov_matrix=cov_matrix,
            pi=pi,
            P=P,
            Q=Q
        )

        ef = EfficientFrontier(expected_returns=bl.bl_returns(), cov_matrix=bl.bl_cov())
        return Portfolio(efficient_frontier=ef)
    
# if __name__ == "__main__":
#     # Create an instance with a valid risk level
#     advisor = RoboAdvisor(risk_level="very_high")

#     print(advisor._get_historical_prices())
#     print(advisor._get_historical_returns())

#     # Test generating portfolio
#     portfolio = advisor.generate_portfolio()
#     print("Generated portfolio:")
#     print(portfolio.get_max_sharpe_ratio_portfolio())
#     print(portfolio.get_RVS())
