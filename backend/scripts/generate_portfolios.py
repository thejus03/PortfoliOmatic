import json
from robot.RoboAdvisor import RoboAdvisor

def generate_portfolios(supabase):
    # Create a dict with risk level and portfolio
    portfolios = dict()

    for risk_level in ["ultra_low", "low", "moderate", "high", "very_high"]:
        portfolios[risk_level] = {}
        advisor = RoboAdvisor(risk_level=risk_level)
        portfolio = advisor.generate_portfolio()
        portfolios[risk_level]["ticker_to_full_info_mapping"], portfolios[risk_level]["asset_class_to_weightage_mapping"] = portfolio.get_max_sharpe_ratio_portfolio()
        portfolios[risk_level]["returns"], portfolios[risk_level]["volatility"], portfolios[risk_level]["sharpe_ratio"] = portfolio.get_RVS()
        portfolios[risk_level]["prices"] = advisor.prices[-1]
        response = supabase.table("Portfolios").eq("name", risk_level).update({
            "tickers_weight": portfolios[risk_level]["ticker_to_full_info_mapping"],
            "asset_class_weight": portfolios[risk_level]["asset_class_to_weightage_mapping"],
        }).execute()
        
        if not response.data:
            return 
        
        portfolio_id = response.data[0]["id"]
        
        # Get previous normalised value  
        response = supabase.table("Portfolio_Value").select("*", count="exact").eq("portfolio_id", portfolio_id).order("date", ascending=False).limit(1).execute()
        if not response.data:
            return 

        value = response.data[0]["normalised_value"]
        no_of_shares = dict()
        for ticker in portfolios[risk_level]["ticker_to_full_info_mapping"]:
            no_of_shares[ticker] = (value * portfolios[risk_level]["ticker_to_full_info_mapping"][ticker]["weightage"]) / portfolios[risk_level]["prices"][ticker]
        
        # Update the portfolio value
        supabase.table("Portfolio_Value").insert({
            "portfolio_id": portfolio_id,
            "value": value,
            "no_of_shares": no_of_shares
        }).execute()
        
    return