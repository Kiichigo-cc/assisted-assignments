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
import { fetchChatLogs } from "../api/ChatbotApi";
import { useLocation } from "react-router-dom";

const Chatlogs = () => {
  const [chatLogs, setChatLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { accessToken } = useAccessToken();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const userId = queryParams.get("userId");
  const assignmentId = queryParams.get("assignmentId");
  const limit = queryParams.get("limit") || 100;
  const offset = queryParams.get("offset") || 0;

  useEffect(() => {
    const getChatLogs = async () => {
      try {
        const data = await fetchChatLogs(
          accessToken,
          userId,
          assignmentId,
          limit,
          offset,
          true
        ); // Call the API function
        setChatLogs(data); // Set the retrieved chat logs in state
        setLoading(false); // Set loading state to false after data is loaded
      } catch (error) {
        console.error("Error fetching chat logs:", error);
        setLoading(false);
      }
    };
    if (accessToken) {
      getChatLogs(); // Only fetch chat logs if accessToken is available
    }
  }, [accessToken]);

  if (loading) {
    return <div>Loading chat logs...</div>;
  }

  return (
    <Card className="max-w-[1000px] mx-auto">
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
                <div className="flex flex-col max-w-[90%]">
                  <small className="block text-sm text-gray-500 py-2">
                    {new Date(log.timestamp).toLocaleString()}
                  </small>
                  <div
                    className={` p-4 pb-6 rounded-lg break-words bg-muted/40 border overflow-auto`}
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
