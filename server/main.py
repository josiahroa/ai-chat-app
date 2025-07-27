from config.config import Config
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket
from langchain_ollama.chat_models import ChatOllama

@asynccontextmanager
async def lifespan(app: FastAPI):
    config = Config()
    app.state.model = config.get_model()
    yield

app = FastAPI(lifespan=lifespan)

@app.get("/health")
def health_check():
    return {"message": "Healthy"}

@app.websocket("/chat")
async def chat(websocket: WebSocket):
    chat_model = ChatOllama(model=app.state.model)

    await websocket.accept()
    while True:
        prompt = await websocket.receive_text()
        chunks = []
        async for chunk in chat_model.astream(prompt):
            chunks.append(chunk)
            await websocket.send_text(chunk.content)


