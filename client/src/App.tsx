import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";

function App() {
  const [chatLog, setChatLog] = useState<string[]>([]);
  const ws = useRef<WebSocket | null>(null);

  const sendPrompt = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") {
      return;
    }
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      return;
    }
    ws.current.send(event.currentTarget.value);
    event.currentTarget.value = "";
  };

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8000/chat");
    ws.current.onmessage = (event) => {
      setChatLog((prev) => [...prev, event.data]);
    };
    ws.current.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  useEffect(() => {
    console.log(chatLog);
  }, [chatLog]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-5/8">
        <p>{chatLog}</p>
      </div>
      <div className="h-10" />
      <div className="w-5/8">
        <Input placeholder="Type your message here." onKeyDown={sendPrompt} />
      </div>
    </div>
  );
}

export default App;
