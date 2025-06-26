import sys
import os
# Add the parent directory (i.e., backend/) to the import path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from robot.RoboAdvisor import RoboAdvisor
import pytest
import pandas as pd
import numpy as np
from unittest.mock import MagicMock
from io import StringIO


# ======================== Mock Data Creation ========================

mock_yaml_string = '- "AAPL" # Apple - equity\n- "BND" # Bond - bond\n'

# Create date index
dates = pd.date_range("2025-01-01", periods=3)

# Create multi-index columns
tickers = ["AAPL", "BND"]
fields = ["Open", "Close"]
multi_index = pd.MultiIndex.from_product([fields, tickers], 
                                         names=["Field", "Ticker"])

# Create mock price data
multi_data = [
    [100, 90, 101, 91],  # 2025-01-01
    [101, 91, 102, 92],  # 2025-01-02
    [102, 92, 103, 93],  # 2025-01-03
]

mock_prices= pd.DataFrame(multi_data, 
                          index=dates, 
                          columns=multi_index)

mock_cov_matrix = pd.DataFrame([[0.01, 0.002], [0.002, 0.005]], 
                               columns=["AAPL", "BND"], 
                               index=["AAPL", "BND"])

mock_apple_annual_returns = ((1 / 101 + 1) * (1 / 102 + 1)) ** (252/2) - 1
mock_bond_annual_returns = ((1 / 91 + 1) * (1 / 92 + 1)) ** (252/2) - 1
mock_historical_annual_returns = pd.Series(
    [mock_apple_annual_returns, mock_bond_annual_returns], 
    index=pd.Index(["AAPL", "BND"], name='Ticker'))

mock_Q = np.array([0.10, 0.10])
mock_P = pd.DataFrame(data=[[1, 0], [0, 1]], columns=["AAPL", "BND"])


# ======================== Fixture Creation ========================

@pytest.fixture
def patch_roboadvisor(monkeypatch):
    monkeypatch.setattr("os.path.join", 
                        lambda *args: "/fake/path.yaml")
    
    monkeypatch.setattr("builtins.open", 
                        lambda *args, **kwargs: StringIO(mock_yaml_string))
    
    monkeypatch.setattr("yfinance.download", 
                        lambda tickers, period: mock_prices)
    
    monkeypatch.setattr("yfinance.Ticker", lambda ticker: MagicMock(info={
        "marketCap": 1e9,
        "targetMeanPrice": 110,
        "currentPrice": 100
    }))

    monkeypatch.setattr("pypfopt.risk_models.sample_cov", 
                        lambda prices: mock_cov_matrix)

    monkeypatch.setattr("pypfopt.black_litterman.market_implied_prior_returns", 
                        lambda market_caps, risk_aversion, cov_matrix: [0.1, 0.03])
    

# ======================== Tests ========================

# Test if reading from the yaml file and
# outputting the ticker to asset class and name mapping is done correctly
def test_roboadvisor_asset_parsing(patch_roboadvisor):
    robo = RoboAdvisor("moderate")
    assert robo.assets == ["AAPL", "BND"]
    assert robo.ticker_to_class_and_name_mapping == {
        "AAPL": {"asset_class": "equity", "asset_name": "Apple"},
        "BND": {"asset_class": "bond", "asset_name": "Bond"}
    }

# Test the historical prices returned
def test_historical_prices(patch_roboadvisor):
    robo = RoboAdvisor("moderate")
    historical_prices = robo._get_historical_prices()
    pd.testing.assert_frame_equal(historical_prices, mock_prices["Close"])

# Test the covariance matrix generated
def test_covariance_matrix(patch_roboadvisor):
    robo = RoboAdvisor("moderate")
    cov_matrix = robo._get_covariance_matrix()
    pd.testing.assert_frame_equal(cov_matrix, mock_cov_matrix)

# Test historical annual returns generated
def test_historical_returns(patch_roboadvisor):
    robo = RoboAdvisor("moderate")
    historical_annual_returns = robo._get_historical_returns()
    pd.testing.assert_series_equal(historical_annual_returns, mock_historical_annual_returns)

# Test the P and Q matrices generated
def test_P_and_Q(patch_roboadvisor):
    robo = RoboAdvisor("moderate")
    P, Q = robo._get_P_and_Q()
    pd.testing.assert_frame_equal(P, mock_P) 
    np.testing.assert_equal(Q, mock_Q)

