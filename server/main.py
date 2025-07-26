from config.config import Config
from contextlib import asynccontextmanager
from fastapi import FastAPI
from pydantic import BaseModel
from langchain_ollama.chat_models import ChatOllama

class ChatRequest(BaseModel):
    message: str

class LLMInterface:
    def __init__(self, model: str):
        self.model = model
    
    def chat(self, request: ChatRequest):
        chat_model = ChatOllama(model=self.model)
        response = chat_model.invoke(request.message)
        return response.content

@asynccontextmanager
async def lifespan(app: FastAPI):
    config = Config()
    app.state.model = config.get_model()
    yield

app = FastAPI(lifespan=lifespan)

@app.get("/health")
def health_check():
    return {"message": "Healthy"}

@app.post("/chat")
def chat(request: ChatRequest):
    llm_interface = LLMInterface(app.state.model)
    return {"message": llm_interface.chat(request)}


