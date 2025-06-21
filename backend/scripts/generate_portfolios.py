import json
from robot.RoboAdvisor import RoboAdvisor

def main():
    # Create a dict with risk level and portfolio
    portfolios = dict()

    for risk_level in ["ultra_low", "low", "moderate", "high", "very_high"]:
        advisor = RoboAdvisor(risk_level=risk_level)
        portfolio = advisor.generate_portfolio()
        portfolios[risk_level] = portfolio.get_max_sharpe_ratio_portfolio()
    
    with open("out/portfolios.json", "w") as f:
        json.dump(portfolios, f, indent=2)
                

if __name__ == "__main__":
    main() 