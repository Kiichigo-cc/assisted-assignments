export async function fetchChatbotResponse(message, user, accessToken, assignmentContext, assignmentId) {
  try {
    const response = await fetch("http://localhost:5001/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ message, user, assignmentContext, assignmentId }),
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

export const fetchChatLogs = async (
  accessToken,
  userId = null,
  assignmentId = null,
  limit = 100,
  offset = 0,
  instructorView = false
) => {
  try {
    // Create a URLSearchParams object to handle query parameters cleanly
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });

    if (userId) {
      params.append("userId", userId);
    }
    if (assignmentId) {
      params.append("assignmentId", assignmentId);
    }
    // Construct the full URL with query parameters
    const url = instructorView
      ? `http://localhost:5001/chat/instructor/logs?${params.toString()}`
      : `http://localhost:5001/chat/user/logs?${params.toString()}`;

    const response = await fetch(url, {
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
