import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { fetchChatbotResponse, fetchChatLogs } from "../api/ChatbotApi"; // Import the API function
import ReactMarkdown from "react-markdown";
import { useAuth0 } from "@auth0/auth0-react";
import useAccessToken from "@/hooks/useAccessToken";
import { useLocation } from "react-router-dom";
import CopyButton from "./copy-button";

export default function Chatbot() {
  const { user } = useAuth0();
  const { search } = useLocation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { accessToken, error } = useAccessToken();

  const urlParams = new URLSearchParams(search);
  const assignmentId = urlParams.get("assignmentId");
  // const purpose = urlParams.get("purpose");
  // const instructions = urlParams.get("instructions");

  const assignmentContext = {
    assignmentId,
    // purpose,
    // instructions,
  };

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const botResponse = await fetchChatbotResponse(
        input,
        user,
        accessToken,
        assignmentContext,
        assignmentId
      );
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: botResponse, sender: "system" },
      ]);
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Error getting response.", sender: "system" },
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

  useEffect(() => {
    const getChatLogs = async () => {
      try {
        const data = await fetchChatLogs(accessToken, user.sub, assignmentId); // Call the API function

        const messages = data.map((log) => ({
          text: log.message,
          sender: log.sender,
        }));
        setMessages(messages); // Set the retrieved chat logs in state
        setLoading(false); // Set loading state to false after data is loaded
      } catch (error) {
        console.error("Error fetching chat logs:", error);
        setLoading(false);
      }
    };
    if (accessToken && user) {
      getChatLogs(); // Only fetch chat logs if accessToken is available
    }
  }, [accessToken]);

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
            <div className="max-w-[90%] space-y-2 flex flex-col">
              <Card
                className={`p-3 overflow-auto text-foreground ${
                  message.sender === "user" ? "bg-background" : "bg-muted/40"
                }`}
              >
                <ReactMarkdown>{message.text}</ReactMarkdown>
              </Card>
              {message.sender === "system" && (
                <CopyButton textToCopy={message.text} />
              )}
            </div>
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
