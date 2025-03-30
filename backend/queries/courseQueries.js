import {
  CourseModel,
  AssignmentModel,
  TaskModel,
  UserModel,
} from "../api/index.js";

export const createNewCourse = async (
  courseName,
  term,
  courseNumber,
  userId
) => {
  const newCourse = await CourseModel.create({
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
  return await CourseModel.findOne({
    where: { id: courseId },
    include: [
      {
        model: AssignmentModel,
        as: "assignments",
        include: [
          {
            model: TaskModel,
            as: "tasks",
            order: [["dueDate", "ASC"]],
          },
        ],
      },
      { model: UserModel, as: "users" },
    ],
  });
};

// Fetch all courses for a user
export const getAllCourses = async (userId) => {
  return await CourseModel.findAll({
    include: [
      {
        model: UserModel,
        as: "users",
        where: { userId },
        required: true,
      },
      {
        model: AssignmentModel,
        as: "assignments",
        include: [
          {
            model: TaskModel,
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
  return await UserModel.findAll({
    include: [
      {
        model: CourseModel,
        as: "courses",
        where: {
          id: courseId,
        },
        required: true,
      },
    ],
  });
};
