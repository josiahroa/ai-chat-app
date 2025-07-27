import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";

interface ChatMessage {
  role: ChatRole;
  content: string;
}

enum ChatRole {
  User = "user",
  Assistant = "assistant",
}

function App() {
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const ws = useRef<WebSocket | null>(null);
  const isStreamingRef = useRef(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  const sendPrompt = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") {
      return;
    }
    const userMessage = event.currentTarget.value.trim();
    if (!userMessage) {
      return;
    }

    // Add user message to chat log
    const userChatMessage: ChatMessage = {
      role: ChatRole.User,
      content: userMessage,
    };
    setChatLog((prev) => [...prev, userChatMessage]);

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(userMessage);
      isStreamingRef.current = true;
    }

    event.currentTarget.value = "";
  };

  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:8000/chat";
    console.log("Connecting to WebSocket:", wsUrl);
    ws.current = new WebSocket(wsUrl);
    ws.current.onmessage = (event) => {
      const data = event.data;

      // Check for end of stream
      if (data === "[DONE]") {
        isStreamingRef.current = false;
        return;
      }

      // Handle streaming assistant response
      setChatLog((prev) => {
        if (!isStreamingRef.current) {
          return prev;
        }

        const lastMessage = prev[prev.length - 1];
        if (lastMessage.role === ChatRole.Assistant) {
          const newMessage = [...prev];
          newMessage[newMessage.length - 1] = {
            ...lastMessage,
            content: lastMessage.content + data,
          };

          return newMessage;
        } else {
          return [
            ...prev,
            {
              role: ChatRole.Assistant,
              content: data,
            },
          ];
        }
      });
    };

    ws.current.onerror = (err) => {
      console.error("WebSocket error:", err);
      isStreamingRef.current = false;
    };

    ws.current.onopen = () => {
      console.log("WebSocket connected successfully");
    };

    ws.current.onclose = (event) => {
      console.log("WebSocket closed:", event.code, event.reason);
      isStreamingRef.current = false;
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatLog]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div ref={chatContainerRef} className="w-5/8 max-h-96 overflow-y-auto">
        {chatLog.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <p className="text-sm font-semibold mb-1">
                {message.role === "user" ? "You" : "Assistant"}
              </p>
              <p>{message.content}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="h-10" />
      <div className="w-5/8">
        <Input placeholder="Type your message here." onKeyDown={sendPrompt} />
      </div>
    </div>
  );
}

export default App;
