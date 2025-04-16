import { Assignment, Task, Course, User } from "../server.js";

//get assignment by its id
export const getAssignmentById = async (assignmentId) => {
  return await Assignment.findOne({
    where: { id: assignmentId },
    include: [
      {
        model: Task,
        as: "tasks", // Include associated tasks
        order: [["dueDate", "ASC"]],
      },
      {
        model: Course, // Include associated course
        as: "course", // Alias defined in the association
        include: [
          {
            model: User, // Include users associated with the course
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
  return await Assignment.findAll({
    where: { courseId: courseId },
    include: [
      {
        model: Task,
        as: "tasks", // Include associated tasks
        order: [["dueDate", "ASC"]],
      },
      {
        model: Course, // Include associated course
        as: "course", // Alias defined in the association
        include: [
          {
            model: User, // Include users associated with the course
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
  return await Task.findOne({
    where: { id: taskId },
    include: [
      {
        model: Assignment, // Include the related Assignment
        as: "assignment", // The alias for the relationship between Task and Assignment
        include: [
          {
            model: Course, // Include the related Course
            as: "course", // The alias for the relationship between Assignment and Course
          },
        ],
      },
    ],
  });
};
