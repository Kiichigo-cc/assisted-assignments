import { fetchChatLogs } from "@/api/ChatbotApi";

// Function to download chat logs for a specific assignment
const downloadChatLogs = async ({
  accessToken,
  user,
  assignmentData,
  instructorView = true,
}) => {
  try {
    const data = await fetchChatLogs(
      accessToken,
      user?.userId,
      assignmentData.id,
      100,
      0,
      instructorView
    );

    const cleanedData = data.map((entry) => ({
      assignmentId: entry.assignmentId,
      timestamp: entry.timestamp,
      sender: entry.sender,
      userName: entry.userName,
      message: entry.message,
    }));

    const blob = new Blob([JSON.stringify(cleanedData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${user?.name || "all-students"}-assignment-${
      assignmentData.name
    }-chatlogs.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Error downloading chat logs:", err);
    alert("Failed to download chat logs.");
  }
};

export default downloadChatLogs;
