from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    def __init__(self):
        self.model = os.getenv("MODEL")
    
    def get_model(self):
        return self.model