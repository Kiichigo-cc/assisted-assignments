import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  //placeholder until ai functionality
  const handleSendMessage = () => {
    if (input.trim() === "") return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: input, sender: "user" },
    ]);

    setInput("");
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "This is a response from the chatbot.", sender: "bot" },
      ]);
    }, 1000);
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
              className={`max-w-[70%] p-3  ${
                message.sender === "user"
                  ? "bg-background text-primary"
                  : "bg-primary text-background"
              }`}
            >
              {message.text}
            </Card>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex-none">
        <div className="flex flex-col w-full space-y-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full resize-none"
            placeholder="Type your message here."
          />
          <div className="flex justify-end">
            <Button onClick={handleSendMessage}>Send message</Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
