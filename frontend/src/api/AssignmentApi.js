// Get the API base URL from the environment variable
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// Create an assignment
export const createAssignment = async (courseId, accessToken, formData) => {
  try {
    const response = await fetch(`${apiBaseUrl}/assignments/${courseId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to create assignment");
    }

    const data = await response.json();
    return data; // Return the response data for further use
  } catch (error) {
    throw new Error("Error creating assignment: " + error.message);
  }
};

// Fetch a specific assignment by ID
export const fetchAssignmentData = async (
  courseId,
  assignmentId,
  accessToken
) => {
  try {
    const response = await fetch(
      `${apiBaseUrl}/assignments/${courseId}/${assignmentId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Assignment not found");
    }

    const data = await response.json();
    return data; // Return the data from the API
  } catch (err) {
    throw new Error(err.message); // Propagate the error for handling
  }
};

// Delete an assignment
export const deleteAssignment = async (courseId, assignmentId, accessToken) => {
  try {
    const response = await fetch(
      `${apiBaseUrl}/assignments/${courseId}/${assignmentId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return { success: true, assignments: data.assignments }; // Return data on success
    } else {
      const error = await response.json();
      return { success: false, message: error.message }; // Return error message
    }
  } catch (error) {
    throw new Error(error.message); // Throw error if the fetch fails
  }
};

// Fetch assignments
export const fetchAssignments = async (courseId, accessToken) => {
  try {
    const response = await fetch(`${apiBaseUrl}/assignments/${courseId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, assignments: data }; // Return assignments on success
    } else {
      return { success: false, message: "Failed to fetch assignments" }; // Return error message
    }
  } catch (error) {
    throw new Error(error.message); // Throw error if the fetch fails
  }
};

// Fetch assignment task by ID
export const fetchAssignmentTask = async (
  courseId,
  assignmentId,
  taskId,
  accessToken
) => {
  try {
    const response = await fetch(
      `${apiBaseUrl}/assignments/${courseId}/${assignmentId}/${taskId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Task not found");
    }

    const data = await response.json();
    return { success: true, data }; // Return data on success
  } catch (error) {
    return { success: false, message: error.message }; // Return error message if the fetch fails
  }
};

// Update an assignment
export const updateAssignment = async (
  courseId,
  assignmentId,
  accessToken,
  formData
) => {
  try {
    const response = await fetch(
      `${apiBaseUrl}/assignments/${courseId}/${assignmentId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update assignment");
    }

    const data = await response.json();
    return data; // Return the response data for further use
  } catch (error) {
    throw new Error("Error creating assignment: " + error.message);
  }
};
