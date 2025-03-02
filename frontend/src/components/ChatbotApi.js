export async function fetchChatbotResponse(message, user, accessToken, assignmentContext ) {
  try {
    const response = await fetch("http://localhost:5001/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ message, user, assignmentContext }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch chatbot response");
    }

    const data = await response.json();
    return data.reply;
  } catch (error) {
    console.error("Error fetching chatbot response:", error);
    throw error;
  }
}

export const fetchChatLogs = async (accessToken) => {
  try {
    const response = await fetch("http://localhost:5001/chat/logs", {
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
    return data; // Return the data to be used in the component
  } catch (error) {
    throw new Error("Error fetching chat logs: " + error.message);
  }
};
