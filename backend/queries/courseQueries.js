import { Course, Assignment, Task, User } from "../server.js";

export const createNewCourse = async (
  courseName,
  term,
  courseNumber,
  userId
) => {
  const newCourse = await Course.create({
    courseName,
    term,
    courseNumber,
  });

  await newCourse.addUser(userId, {
    through: { role: "instructor" },
  });

  return newCourse;
};

export const getCourseById = async (courseId) => {
  return await Course.findOne({
    where: { id: courseId },
    include: [
      {
        model: Assignment,
        as: "assignments",
        include: [
          {
            model: Task,
            as: "tasks",
            order: [["dueDate", "ASC"]],
          },
        ],
      },
      { model: User, as: "users" },
    ],
  });
};

// Fetch all courses for a user
export const getAllCourses = async (userId) => {
  return await Course.findAll({
    include: [
      {
        model: User,
        as: "users",
        where: { userId },
        required: true,
      },
      {
        model: Assignment,
        as: "assignments",
        include: [
          {
            model: Task,
            as: "tasks",
            order: [["dueDate", "ASC"]],
          },
        ],
      },
    ],
  });
};

// Fetch all users in a course by courseId
export const getUsersInCourse = async (courseId) => {
  return await User.findAll({
    include: [
      {
        model: Course,
        as: "courses",
        where: {
          id: courseId,
        },
        required: true,
      },
    ],
  });
};
