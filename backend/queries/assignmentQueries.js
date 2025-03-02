import { AssignmentModel, TaskModel } from "../server.js";

//get assignment by its id
export const getAssignmentById = async (assignmentId) => {
  return await AssignmentModel.findOne({
    where: { id: assignmentId },
    include: [
      {
        model: TaskModel,
        as: "tasks", // Include associated tasks
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
      },
    ],
  });
};
