import yfinance as yf
import pandas as pd
from pypfopt import risk_models, expected_returns, black_litterman, EfficientFrontier

class Portfolio:
    def __init__(self, efficient_frontier: EfficientFrontier, risk_free_rate=0):
        self.ef = efficient_frontier
        self.initialised = False
        self.risk_free_rate = risk_free_rate
    
    # returns a dictionary mapping ticker to weight in the max sharpe ratio portfolio
    def get_max_sharpe_ratio_portfolio(self, risk_free_rate=None):
        self.initialised = True

        if risk_free_rate:
            self.risk_free_rate = risk_free_rate
        
        self.ef.max_sharpe(risk_free_rate=self.risk_free_rate)
        return self.ef.clean_weights()

    # returns a dictionary mapping ticker to weight in the min volatility portfolio
    def get_min_volatility_portfolio(self):
        self.initialised = True
        self.ef.min_volatility()
        return self.ef.clean_weights()
    
    # returns the expected return, annual volatility and sharpe ratio of the portfolio
    def get_RVS(self):
        if self.initialised:
            return self.ef.portfolio_performance()
        else:
            return None