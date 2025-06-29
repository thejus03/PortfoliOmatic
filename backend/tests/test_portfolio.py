import sys
import os
# Add the parent directory (i.e., backend/) to the import path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from robot.Portfolio import Portfolio
import pytest
from unittest.mock import MagicMock


# ======================== Fixture Creation ========================

@pytest.fixture
def mock_portfolio():
    mock_ef = MagicMock()
    mock_ef.max_sharpe.return_value = None
    mock_ef.min_volatility.return_value = None
    mock_ef.clean_weights.return_value = {"AAPL": 0.6, "BND": 0.4}
    mock_ef.portfolio_performance.return_value = (0.08, 0.12, 0.67)

    mapping = {
        "AAPL": {"asset_class": "equity", "asset_name": "Apple"},
        "BND": {"asset_class": "bond", "asset_name": "Bond"},
    }

    return Portfolio(efficient_frontier=mock_ef, ticker_to_class_and_name_mapping=mapping)


# ======================== Tests ========================

# Testing the Max. Sharpe Ratio Portfolio Generator
def test_max_sharpe(mock_portfolio):
    result = mock_portfolio.get_max_sharpe_ratio_portfolio()
    assert result[0] == {
        "AAPL": {"asset_class": "equity", "asset_name": "Apple", "weightage": 0.6},
        "BND": {"asset_class": "bond", "asset_name": "Bond", "weightage": 0.4},
    }
    assert result[1] == {
        "equity": 0.6,
        "bond": 0.4,
        "returns": 0.08,
        "volatility": 0.12
    }

# Testing the Min. Volatility Portfolio Generator
def test_min_volatility(mock_portfolio):
    result = mock_portfolio.get_min_volatility_portfolio()
    assert result[0] == {
        "AAPL": {"asset_class": "equity", "asset_name": "Apple", "weightage": 0.6},
        "BND": {"asset_class": "bond", "asset_name": "Bond", "weightage": 0.4},
    }
    assert result[1] == {
        "equity": 0.6,
        "bond": 0.4,
    }

# Testing the Returns, Volatility and Sharpe Ratio values
def test_rvs(mock_portfolio):
    mock_portfolio.initialised = True
    expected_return, volatility, sharpe_ratio = mock_portfolio.get_RVS()
    assert expected_return == 0.08
    assert volatility == 0.12
    assert sharpe_ratio == 0.67
