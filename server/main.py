from config.config import Config
from typing import Union
from contextlib import asynccontextmanager
from fastapi import FastAPI


@asynccontextmanager
async def lifespan(app: FastAPI):
    config = Config()
    app.state.model = config.get_model()
    yield

app = FastAPI(lifespan=lifespan)

@app.get("/health")
def health_check():
    return {"message": "Healthy", "model": app.state.model}

