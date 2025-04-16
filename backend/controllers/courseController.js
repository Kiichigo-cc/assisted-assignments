import { User, Task, Assignment } from "../server.js";
import {
  createNewCourse,
  getCourseById,
  getAllCourses,
  getUsersInCourse,
} from "../queries/courseQueries.js";
import { getAssignmentByCourseId } from "../queries/assignmentQueries.js";

export const createCourse = async (req, res) => {
  try {
    const { courseName, term, courseNumber } = req.body.newCourse;
    const userId = req.body.user.sub;
    const name = req.body.user.nickname;
    const picture = req.body.user.picture;

    if (!courseName || !term || !courseNumber) {
      return res.status(400).json({ error: "All fields are required" });
    }

    let user = await User.findByPk(userId);
    if (!user) {
      user = await User.create({
        userId,
        profilePicture: picture,
        name: name,
      });
    }

    const newCourse = await createNewCourse(
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

export const deleteCourse = async (req, res) => {
  const { id: courseId } = req.params;

  console.log("courseId", courseId);

  try {
    // Fetch the course by courseId
    const course = await getCourseById(courseId);

    console.log("course", course);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Fetch all assignments associated with the course
    const assignments = await getAssignmentByCourseId(courseId);

    console.log("assignments", assignments);

    if (assignments.length > 0) {
      // Delete all tasks associated with the assignments
      for (const assignment of assignments) {
        await Task.destroy({
          where: {
            assignmentId: assignment.id,
          },
        });
      }

      // Delete all assignments associated with the course
      await Assignment.destroy({
        where: {
          courseId: course.id,
        },
      });
    }

    // Delete the course itself
    await course.destroy();

    return res.status(200).json({
      message: "Course, assignments, and tasks deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete course" });
  }
};

export const updateCourse = async (req, res) => {
  const { id: courseId } = req.params;
  const { courseName, term, courseNumber } = req.body;

  try {
    const course = await getCourseById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    course.courseName = courseName;
    course.term = term;
    course.courseNumber = courseNumber;

    await course.save();

    return res.status(200).json(course);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update course" });
  }
};
