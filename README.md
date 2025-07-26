# ai-chat-app

An AI chat application built using React, Python, Langchain, and Ollama.

## Getting Started

1. Configure environment variables for server.

   a. Init a .env file from .env.example

   ```
   cd ./server
   cp .env.example .env
   ```

   b. Fill out required environment variables in `./server/.env`

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

   b. Update the MODEL env in `./server/.env`
