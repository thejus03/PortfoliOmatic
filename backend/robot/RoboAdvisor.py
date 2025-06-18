import yaml
class RoboAdvisor:
    def __init__(self, risk_level: str):
       # risk level: ultra_low, low, medium, high, very high
       self.risk_level = risk_level
       self.assets = self._get_assets()

    def _get_assets(self):
        file = f"assets/{self.risk_level}.yaml"
        with open(file, "r") as f:
            data = yaml.safe_load(f)
        return data["tickers"]
    