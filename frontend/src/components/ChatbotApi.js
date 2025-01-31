export async function fetchChatbotResponse(message, user, accessToken) {
  try {
    const response = await fetch("http://localhost:5001/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ message, user }),
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
