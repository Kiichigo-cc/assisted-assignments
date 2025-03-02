import {
  CourseModel,
  AssignmentModel,
  TaskModel,
  UserModel,
} from "../server.js";

export const createNewCourse = async (
  courseId,
  courseName,
  term,
  courseNumber,
  userId
) => {
  const newCourse = await CourseModel.create({
    key: courseId,
    courseName,
    courseId,
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
          },
        ],
      },
      { model: UserModel },
    ],
  });
};

// Fetch all courses for a user
export const getAllCourses = async (userId) => {
  return await CourseModel.findAll({
    include: [
      {
        model: UserModel,
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
        where: {
          id: courseId,
        },
        required: true,
      },
    ],
  });
};
