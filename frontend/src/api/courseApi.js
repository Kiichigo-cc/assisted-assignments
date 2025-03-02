export const createCourse = async (newCourse, user, accessToken) => {
  try {
    const response = await fetch("http://localhost:5001/courses", {
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

export const fetchCourse = async (courseId, accessToken) => {
  try {
    const response = await fetch(`http://localhost:5001/courses/${courseId}`, {
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

export const joinCourse = async (accessCode, user, accessToken) => {
  try {
    const response = await fetch("http://localhost:5001/join-course", {
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

export const generateInviteCode = async (courseId, accessToken) => {
  try {
    const response = await fetch("http://localhost:5001/generate-access-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ courseId }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error("Failed to generate invite code");
    }

    return { success: true, accessCode: data.accessCode };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
