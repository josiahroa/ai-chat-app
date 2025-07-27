from config.config import Config
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from langchain_ollama.chat_models import ChatOllama

@asynccontextmanager
async def lifespan(app: FastAPI):
    config = Config()
    app.state.model = config.get_model()
    app.state.ollama_base_url = config.get_ollama_base_url()
    yield

app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"message": "Healthy"}

@app.websocket("/chat")
async def chat(websocket: WebSocket):
    # If a base url is provided, connect to Ollama running on the host machine
    if app.state.ollama_base_url:
        base_url = app.state.ollama_base_url
    else:
        base_url = None

    chat_model = ChatOllama(
        model=app.state.model,
        base_url=base_url
    )

    await websocket.accept()
    while True:
        prompt = await websocket.receive_text()
        chunks = []
        async for chunk in chat_model.astream(prompt):
            chunks.append(chunk)
            await websocket.send_text(chunk.content)
        await websocket.send_text("[DONE]")


