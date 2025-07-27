from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    def __init__(self):
        self.model = os.getenv("MODEL")
        self.ollama_base_url = os.getenv("OLLAMA_BASE_URL")
    
    def get_model(self):
        return self.model
    
    def get_ollama_base_url(self):
        return self.ollama_base_url