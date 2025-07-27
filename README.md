# ai-chat-app

An very simple local AI chat application built using React, Python, Langchain, and Ollama.

## Prerequisites

1. [Docker](https://docs.docker.com/get-started/)

2. [Ollama](https://ollama.com/)

### Development Workflow

1. [uv](https://docs.astral.sh/uv/getting-started/)

2. [pnpm](https://pnpm.io/installation)

### For Mac

["On the Mac, please run Ollama as a standalone application outside of Docker containers as Docker Desktop does not support GPUs."](https://ollama.com/blog/ollama-is-now-available-as-an-official-docker-image)

1. Download [ollama](https://ollama.com/)

2. Serve ollama with llama3.2

   ```
   ollama run llama3.2
   ```

   If you would like to use a different model from the list of [supported models](https://ollama.com/library), please follow these steps:

   a. Run with the model you would like to use

   ```
   ollama run <desired_model>
   ```

   b. If running locally, update the MODEL env in `./server/.env`.

   c. If running in Docker, update the MODEL for the server environment in `./docker-compose.yml`

## Getting Started

Make sure to read the Prerequisites before getting started!

### Docker Workflow

1. Build and run the application

   ```
   docker compose build
   docker compose up
   ```

2. The app is now available at `http://localhost:5173/`

### Development Workflow

1. Set server environment variables

   ```
   cd server
   cp .env.example .env
   ```

   Fill out the required environment variables

2. Install server dependencies

   ```
   uv sync --locked
   ```

3. Run the server

   ```
   uv run fastapi run main.py
   ```

4. Install client dependencies

   ```
   cd ../client
   pnpm install
   ```

5. Run the client

   ```
   pnpm run dev
   ```

6. The app is now available at `http://localhost:5173/`
