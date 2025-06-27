import pandas as pd
from pypfopt import EfficientFrontier

class Portfolio:
    def __init__(self, efficient_frontier: EfficientFrontier, ticker_to_class_and_name_mapping, risk_free_rate=0):
        self.ef = efficient_frontier
        self.ticker_to_class_and_name_mapping = ticker_to_class_and_name_mapping
        self.initialised = False
        self.risk_free_rate = risk_free_rate
    
    # returns a dictionary mapping ticker to weight in the max sharpe ratio portfolio
    def get_max_sharpe_ratio_portfolio(self, risk_free_rate=None):
        self.initialised = True

        if risk_free_rate:
            self.risk_free_rate = risk_free_rate
        
        self.ef.max_sharpe(risk_free_rate=self.risk_free_rate)
        ticker_to_weightage_mapping = self.ef.clean_weights()

        asset_class_to_weightage_mapping = {}
        ticker_to_full_info_mapping = {}

        for ticker in ticker_to_weightage_mapping:
            if ticker_to_weightage_mapping[ticker] == 0.0:
                continue
        
            info = self.ticker_to_class_and_name_mapping[ticker]
            info["weightage"] = ticker_to_weightage_mapping[ticker]
            
            if info["asset_class"] in asset_class_to_weightage_mapping:
                asset_class_to_weightage_mapping[info["asset_class"]] += ticker_to_weightage_mapping[ticker]
            else:
                asset_class_to_weightage_mapping[info["asset_class"]] = ticker_to_weightage_mapping[ticker]
            
            ticker_to_full_info_mapping[ticker] = info
        
        returns, volatility, sharpe_ratio = self.get_RVS()

        asset_class_to_weightage_mapping["returns"] = float(returns)
        asset_class_to_weightage_mapping["volatility"] = float(volatility)

        return ticker_to_full_info_mapping, asset_class_to_weightage_mapping

    # returns a dictionary mapping ticker to weight in the min volatility portfolio
    def get_min_volatility_portfolio(self):
        self.initialised = True
        
        self.ef.min_volatility()
        ticker_to_weightage_mapping = self.ef.clean_weights()

        asset_class_to_weightage_mapping = {}
        ticker_to_full_info_mapping = {}

        for ticker in ticker_to_weightage_mapping:
            if ticker_to_weightage_mapping[ticker] == 0.0:
                continue
        
            info = self.ticker_to_class_and_name_mapping[ticker]
            info["weightage"] = ticker_to_weightage_mapping[ticker]
            
            if info["asset_class"] in asset_class_to_weightage_mapping:
                asset_class_to_weightage_mapping[info["asset_class"]] += ticker_to_weightage_mapping[ticker]
            else:
                asset_class_to_weightage_mapping[info["asset_class"]] = ticker_to_weightage_mapping[ticker]
            
            ticker_to_full_info_mapping[ticker] = info

        return ticker_to_full_info_mapping, asset_class_to_weightage_mapping

    
    # returns the expected return, annual volatility and sharpe ratio of the portfolio
    def get_RVS(self):
        if self.initialised:
            return self.ef.portfolio_performance(risk_free_rate=self.risk_free_rate)
        else:
            return None