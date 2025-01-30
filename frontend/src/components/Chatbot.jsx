import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { fetchChatbotResponse } from "./ChatbotApi"; // Import the API function
import ReactMarkdown from "react-markdown";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const botResponse = await fetchChatbotResponse(input);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: botResponse, sender: "bot" },
      ]);
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Error getting response.", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="w-full h-screen max-h-screen mx-auto max-w-[1000px] flex flex-col">
      <CardContent className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-gray-500 scrollbar-track-transparent">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex py-4 ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <Card
              className={`max-w-[70%] p-3 ${
                message.sender === "user"
                  ? "bg-background text-foreground"
                  : "bg-muted/40 text-foreground"
              }`}
            >
              <ReactMarkdown>{message.text}</ReactMarkdown>
            </Card>
          </div>
        ))}
        {loading && <div className="text-center text-gray-500">Typing...</div>}
      </CardContent>
      <CardFooter className="flex-none">
        <div className="flex flex-col w-full space-y-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full resize-none"
            placeholder="Type your message here."
            disabled={loading}
          />
          <div className="flex justify-end">
            <Button onClick={handleSendMessage} disabled={loading}>
              {loading ? "Sending..." : "Send message"}
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
