import json
from robot.RoboAdvisor import RoboAdvisor

def main():
    # Create a dict with risk level and portfolio
    portfolios = dict()

    for risk_level in ["ultra_low", "low", "moderate", "high", "very_high"]:
        portfolios[risk_level] = {}
        advisor = RoboAdvisor(risk_level=risk_level)
        portfolio = advisor.generate_portfolio()
        portfolios[risk_level]["ticker_to_full_info_mapping"], portfolios[risk_level]["asset_class_to_weightage_mapping"] = portfolio.get_max_sharpe_ratio_portfolio()
        portfolios[risk_level]["returns"], portfolios[risk_level]["volatility"], portfolios[risk_level]["sharpe_ratio"] = portfolio.get_RVS()
    
    with open("out/portfolios.json", "w") as f:
        json.dump(portfolios, f, indent=2)
                

if __name__ == "__main__":
    main() 