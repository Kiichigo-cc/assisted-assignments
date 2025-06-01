// Get the API base URL from the environment variable
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// Fetch metrics and issues for a specific course and assignment
export const getMetricsAndIssues = async (
  courseId,
  assignmentId,
  accessToken
) => {
  try {
    // Construct the API URL dynamically using the courseId and assignmentId
    const url = `${apiBaseUrl}/reports/metrics/${courseId}/${assignmentId}`;

    // Make the fetch request with the provided accessToken
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Check if the response is okay
    if (!response.ok) {
      throw new Error("Failed to fetch metrics and issues");
    }

    // Parse the JSON response
    const data = await response.json();

    // Return the metrics and issues data
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
