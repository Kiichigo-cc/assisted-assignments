import React, { useEffect, useState } from "react";
import useAccessToken from "@/hooks/useAccessToken";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

const Chatlogs = () => {
  const [chatLogs, setChatLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { accessToken, error } = useAccessToken();

  useEffect(() => {
    // Function to fetch chat logs from the backend
    const fetchChatLogs = async () => {
      try {
        const response = await fetch("http://localhost:5001/chatlogs", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch chat logs");
        }
        const data = await response.json();
        setChatLogs(data); // Set the retrieved chat logs in state
        setLoading(false); // Set loading state to false after data is loaded
      } catch (error) {
        setLoading(false);
      }
    };

    fetchChatLogs();
  }, [accessToken]);

  if (loading) {
    return <div>Loading chat logs...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chat Logs</CardTitle>
      </CardHeader>
      <CardContent>
        {chatLogs.length === 0 ? (
          <p>No chat logs available.</p>
        ) : (
          <ul>
            {chatLogs.map((log) => (
              <li
                key={log.chatId}
                className={`flex  ${
                  log.sender === "user"
                    ? "justify-end text-right"
                    : "justify-start"
                } mb-3`}
              >
                <div className="flex flex-col max-w-[60%] ">
                  <small className="block text-sm text-gray-500 py-2">
                    {new Date(log.timestamp).toLocaleString()}
                  </small>
                  <div
                    className={` p-4 pb-6 rounded-lg break-words bg-muted/40 border`}
                  >
                    <strong className="text-primary">{log.userName}:</strong>
                    <ReactMarkdown>{log.message}</ReactMarkdown>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default Chatlogs;
