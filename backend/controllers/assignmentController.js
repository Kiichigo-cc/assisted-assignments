import {
  getAssignmentByCourseId,
  getAssignmentById,
  getTaskById,
} from "../queries/assignmentQueries.js";
import { Assignment, Task } from "../server.js";

export const getAssignments = async (req, res) => {
  const { courseId, assignmentId } = req.params;

  try {
    if (assignmentId != null) {
      // Fetch a single assignment within a course
      const assignment = await getAssignmentById(assignmentId);
      return res.status(200).json(assignment);
    } else {
      // Fetch all assignments within a course
      const assignments = await getAssignmentByCourseId(courseId);
      return res.status(200).json(assignments);
    }
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch assignments" });
  }
};

export const createAssignment = async (req, res) => {
  const { courseId } = req.params;
  const {
    name,
    promptInstructions,
    purpose,
    instructions,
    submission,
    grading,
    points,
    dueDate,
    tasks,
  } = req.body;

  try {
    const assignment = await Assignment.create({
      name,
      promptInstructions,
      purpose,
      instructions,
      submission,
      grading,
      points,
      dueDate,
      courseId,
    });

    // If there are tasks, create them and associate with the assignment
    if (tasks) {
      const taskPromises = tasks.map((task) =>
        Task.create({
          ...task,
          assignmentId: assignment.id, // Link the task to the created assignment
        })
      );

      // Wait for all tasks to be created
      await Promise.all(taskPromises);
    }

    const assignments = await getAssignmentByCourseId(courseId);

    return res.status(201).json(assignments);
  } catch (error) {
    console.error("Error creating assignment:", error);
    return res.status(500).json({ error: "Failed to create assignment" });
  }
};

export const deleteAssignment = async (req, res) => {
  const { courseId, assignmentId } = req.params;

  try {
    const assignment = await getAssignmentById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    // Delete the tasks associated with the assignment
    await Task.destroy({
      where: {
        assignmentId: assignment.id,
      },
    });

    // Delete the assignment itself
    await assignment.destroy();

    // Fetch remaining assignments in the course
    const assignments = await getAssignmentByCourseId(courseId);

    return res.status(200).json({
      message: "Assignment and tasks deleted successfully",
      assignments,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete assignment" });
  }
};

export const editAssignment = async (req, res) => {
  const { courseId, assignmentId } = req.params;
  const {
    name,
    purpose,
    promptInstructions,
    instructions,
    submission,
    grading,
    points,
    dueDate,
    tasks,
  } = req.body;

  try {
    // Fetch the assignment to edit
    const assignment = await getAssignmentById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    // Replace the assignment data with the new data from the request body
    assignment.name = name;
    assignment.promptInstructions = promptInstructions;
    assignment.purpose = purpose;
    assignment.instructions = instructions;
    assignment.submission = submission;
    assignment.grading = grading;
    assignment.points = points;
    assignment.dueDate = dueDate;

    // Save the updated assignment (this will replace the old assignment with the new one)
    await assignment.save();

    // If there are tasks, delete existing ones and create the new tasks
    await Task.destroy({
      where: {
        assignmentId: assignment.id,
      },
    });

    if (tasks && tasks.length > 0) {
      const taskPromises = tasks.map((task) =>
        Task.create({
          ...task,
          assignmentId: assignment.id, // Link the task to the updated assignment
        })
      );
      await Promise.all(taskPromises);
    }

    // Fetch all assignments for the course after update
    const assignments = await getAssignmentByCourseId(courseId);

    return res.status(200).json(assignments);
  } catch (error) {
    console.error("Error updating assignment:", error);
    return res.status(500).json({ error: "Failed to update assignment" });
  }
};

export const getTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await getTaskById(taskId);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    return res.status(200).json(task);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
