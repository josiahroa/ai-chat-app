import { Input } from "@/components/ui/input";
import { useState } from "react";

function App() {
  const [response, setResponse] = useState<string>("");

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      // TODO: Send message to server
      event.currentTarget.value = "";
      setResponse("Hello World");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-5/8">
        <p className="">{response}</p>
      </div>
      <div className="h-10" />
      <div className="w-5/8">
        <Input
          placeholder="Type your message here."
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}

export default App;
