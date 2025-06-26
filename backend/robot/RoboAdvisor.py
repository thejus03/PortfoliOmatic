import yaml
import yfinance as yf
import pandas as pd
import numpy as np
from pypfopt import risk_models, black_litterman, EfficientFrontier
from robot.Portfolio import Portfolio
import os

class RoboAdvisor:
    def __init__(self, risk_level: str):
       # risk level: ultra_low, low, moderate, high, very_high
       self.risk_level = risk_level
       self.assets, self.ticker_to_class_and_name_mapping = self._get_assets()
       self.prices = self._get_historical_prices()

    def _get_assets(self) -> list[str]:
        # Get absolute path of the current file (RoboAdvisor.py)
        base_dir = os.path.dirname(__file__)
        
        # Go up one directory (from 'robot' to 'backend')
        backend_dir = os.path.abspath(os.path.join(base_dir, ".."))
        
        # Build full path to the YAML file
        file_path = os.path.join(backend_dir, "assets", f"{self.risk_level}.yaml")

        with open(file_path, "r") as f:
            lines = f.readlines()

        tickers = []
        ticker_to_class_and_name_mapping = {}

        for line in lines:
            if line.strip().startswith('-'):
                parts = line.split('#')
                ticker = parts[0].strip().lstrip('-').strip().strip('"')
                tickers.append(ticker)
                if len(parts) > 1 and '-' in parts[1]:
                    asset_class = parts[1].split('-')[-1].strip()
                    asset_name = parts[1].split('-')[0].strip()
                    ticker_to_class_and_name_mapping[ticker] = {"asset_class": asset_class.lower(), "asset_name": asset_name}
        
        return tickers, ticker_to_class_and_name_mapping

    # Method to get daily adjusted closing price of assets
    def _get_historical_prices(self):
        return yf.download(self.assets, period="5y")["Close"]
    
    # Method to get covariance of all assets
    def _get_covariance_matrix(self):
        return risk_models.sample_cov(self.prices)
    
    # Method to get market cap of assets - currently not in use
    def _get_market_caps(self):
        market_caps = {}
        for ticker in self.assets:
            market_caps[ticker] = yf.Ticker(ticker).info.get("marketCap")
        return market_caps
    
    # Method to reverse engineer expected returns from market cap of assets - currently not in use
    def _get_implied_returns(self):
        return black_litterman.market_implied_prior_returns(
            market_caps=self._get_market_caps(),
            risk_aversion=1,
            cov_matrix=self._get_covariance_matrix()
        )
    
    # Method to get historical returns
    def _get_historical_returns(self):
        prices = self.prices
        daily_returns = prices.pct_change().dropna()

        # Calculate geometric annual return for each asset
        compounded_growth = (1 + daily_returns).prod()
        n_days = daily_returns.shape[0]
        
        annual_returns = compounded_growth ** (252 / n_days) - 1
        return annual_returns

    # Method to get Pick and View Matrices
    def _get_P_and_Q(self):
        Q = []
        P_rows = []

        for i, ticker in enumerate(self.assets):
            info = yf.Ticker(ticker).info
            target = info.get("targetMeanPrice")
            current = info.get("currentPrice")

            if target is None or current is None:
                continue  # Skip this view if data is missing

            expected_return = (target - current) / current
            Q.append(expected_return)

            row = [0] * len(self.assets)
            row[i] = 1
            P_rows.append(row)

        P = pd.DataFrame(P_rows, columns=self.assets)
        Q = np.array(Q)

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

        # Generate the efficient frontier with max weightage of any asset set to 30% (prevent oversaturation in a particular asset)
        ef = EfficientFrontier(expected_returns=bl.bl_returns(), cov_matrix=bl.bl_cov(), weight_bounds=(0, 0.3))

        return Portfolio(efficient_frontier=ef, ticker_to_class_and_name_mapping=self.ticker_to_class_and_name_mapping)
    
# if __name__ == "__main__":
#     # Create an instance with a valid risk level
#     advisor = RoboAdvisor(risk_level="moderate")

#     # Test generating portfolio
#     portfolio = advisor.generate_portfolio()
#     ticker_to_full_info_mapping, asset_class_to_weightage_mapping = portfolio.get_max_sharpe_ratio_portfolio()

#     print("\n Ticker to full info mapping:")
#     print(ticker_to_full_info_mapping)

#     print("\n Asset class to weightage mapping: ")
#     print(asset_class_to_weightage_mapping)

#     returns, volatility, sharpe_ratio  = portfolio.get_RVS()

#     print("\n Returns:")
#     print(returns)

#     print("\n Volatility:")
#     print(volatility)

#     print("\n Sharpe_ratio:")
#     print(sharpe_ratio)
