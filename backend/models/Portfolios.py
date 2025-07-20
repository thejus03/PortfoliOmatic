from pydantic import BaseModel

class UpdatePortfolioRequest(BaseModel):
    risk_level: str
    tickers: dict
    asset_class_weight: dict

class SetPortfolioRequest(BaseModel):
    portfolio_id: int

class PortfolioSuggestionsRequest(BaseModel):
    score: float

class UpdateCapitalInvestedRequest(BaseModel):
    capital: float
    portfolio_id: int