import {
  AssignmentModel,
  TaskModel,
  CourseModel,
  UserModel,
} from "../api/index.js";

//get assignment by its id
export const getAssignmentById = async (assignmentId) => {
  return await AssignmentModel.findOne({
    where: { id: assignmentId },
    include: [
      {
        model: TaskModel,
        as: "tasks", // Include associated tasks
        order: [["dueDate", "ASC"]],
      },
      {
        model: CourseModel, // Include associated course
        as: "course", // Alias defined in the association
        include: [
          {
            model: UserModel, // Include users associated with the course
            as: "users", // Alias for users
            through: { attributes: [] }, // To avoid including the "through" table
            required: true,
          },
        ],
      },
    ],
  });
};

//get all assignments by course id
export const getAssignmentByCourseId = async (courseId) => {
  return await AssignmentModel.findAll({
    where: { courseId: courseId },
    include: [
      {
        model: TaskModel,
        as: "tasks", // Include associated tasks
        order: [["dueDate", "ASC"]],
      },
      {
        model: CourseModel, // Include associated course
        as: "course", // Alias defined in the association
        include: [
          {
            model: UserModel, // Include users associated with the course
            as: "users", // Alias for users
            through: { attributes: [] }, // To avoid including the "through" table
            required: true,
          },
        ],
      },
    ],
  });
};

export const getTaskById = async (taskId) => {
  return await TaskModel.findOne({
    where: { id: taskId },
    include: [
      {
        model: AssignmentModel, // Include the related Assignment
        as: "assignment", // The alias for the relationship between Task and Assignment
        include: [
          {
            model: CourseModel, // Include the related Course
            as: "course", // The alias for the relationship between Assignment and Course
          },
        ],
      },
    ],
  });
};
