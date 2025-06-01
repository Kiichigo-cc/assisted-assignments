// Get the API base URL from the environment variable
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// Create a course
export const createCourse = async (newCourse, user, accessToken) => {
  try {
    const response = await fetch(`${apiBaseUrl}/courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ newCourse, user }),
    });

    if (!response.ok) {
      throw new Error("Failed to add course");
    }

    const addedCourse = await response.json();
    return { success: true, addedCourse }; // Return the added course if successful
  } catch (error) {
    return { success: false, message: error.message }; // Return error message if the fetch fails
  }
};

// Fetch a specific course by ID
export const fetchCourse = async (courseId, accessToken) => {
  try {
    const response = await fetch(`${apiBaseUrl}/courses/${courseId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error("Course not found or error fetching data");
    }

    return { success: true, course: data.course, users: data.users };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Fetch all courses
export const fetchAllCourses = async (accessToken) => {
  try {
    const response = await fetch(`${apiBaseUrl}/courses`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error("Error fetching courses");
    }

    return { success: true, courses: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Delete a course
export const deleteCourse = async (courseId, accessToken) => {
  try {
    const response = await fetch(`${apiBaseUrl}/courses/${courseId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete course");
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Join a course
export const joinCourse = async (accessCode, user, accessToken) => {
  try {
    const response = await fetch(`${apiBaseUrl}/courses/join-course`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ accessCode, user }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to join the course.");
    }

    return {
      success: true,
      message: `Successfully joined course with code: ${accessCode}`,
    }; // Return success message if the course is joined
  } catch (error) {
    return { success: false, message: error.message }; // Return error message if the fetch fails
  }
};

// Update course details
export const updateCourse = async (courseId, updatedCourse, accessToken) => {
  try {
    const response = await fetch(`${apiBaseUrl}/courses/${courseId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(updatedCourse),
    });

    if (!response.ok) {
      throw new Error("Failed to update course");
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
