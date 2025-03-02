import { UserModel } from "../server.js";
import {
  createNewCourse,
  getCourseById,
  getAllCourses,
  getUsersInCourse,
} from "../queries/courseQueries.js";

export const createCourse = async (req, res) => {
  try {
    const { courseName, courseId, term, courseNumber } = req.body.newCourse;
    const userId = req.body.user.sub;
    const name = req.body.user.nickname;
    const picture = req.body.user.picture;

    if (!courseName || !courseId || !term || !courseNumber) {
      return res.status(400).json({ error: "All fields are required" });
    }

    let user = await UserModel.findByPk(userId);
    if (!user) {
      user = await UserModel.create({
        userId,
        profilePicture: picture,
        name: name,
      });
    }

    const newCourse = await createNewCourse(
      courseId,
      courseName,
      term,
      courseNumber,
      userId
    );

    console.log("New Course Added:", newCourse);
    res.status(201).json(newCourse);
  } catch (error) {
    console.error("Error adding course:", error);
    res.status(500).json({ error: "Failed to add course" });
  }
};

export const getCourses = async (req, res) => {
  try {
    const userId = req.user.sub;
    const { id: courseId } = req.params;
    // If courseId is provided, fetch the course by id
    // Otherwise, fetch all courses for the user
    console.log("courseID", courseId);
    if (courseId) {
      const course = await getCourseById(courseId);
      console.log("Course:", course);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
      const usersInCourse = await getUsersInCourse(courseId);
      return res.status(200).json({ course, users: usersInCourse });
    } else {
      const courses = await getAllCourses(userId);
      return res.status(200).json(courses);
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};
