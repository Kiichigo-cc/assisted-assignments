import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { EllipsisVertical } from "lucide-react";
import AssignmentDialog from "./AssignmentForm";
import { toast } from "sonner";
import { deleteAssignment } from "../../api/AssignmentApi";
import { DialogTrigger } from "@radix-ui/react-dialog";
import InstructorAccess from "../user-permissions/InstructorAccess";
import CopyButton from "../copy-button";
import { useNavigate } from "react-router-dom";
import useAccessToken from "@/hooks/useAccessToken";

export default function AssignmentDropdown({
  assignment,
  course,
  updateAssignments = null,
}) {
  const navigate = useNavigate();
  const { accessToken } = useAccessToken();

  const handleDelete = async (courseId, assignmentId) => {
    try {
      const { success, assignments, message } = await deleteAssignment(
        courseId,
        assignmentId,
        accessToken
      );

      if (success) {
        if (updateAssignments) {
          updateAssignments(assignments);
        }
        navigate(`/courses/${courseId}`);
        toast("Assignment and tasks deleted successfully");
      } else {
        toast(`Failed to delete: ${message}`);
      }
    } catch (error) {
      toast(`Error: ${error.message}`);
    }
  };

  return (
    <InstructorAccess>
      <AssignmentDialog
        updateAssignments={updateAssignments}
        _date={new Date(assignment.dueDate).toString()}
        _name={assignment.name}
        _promptInstructions={assignment.promptInstructions}
        _points={assignment.points}
        _purpose={assignment.purpose}
        _instructions={assignment.instructions}
        _grading={assignment.grading}
        _submission={assignment.submission}
        _tasks={assignment.tasks.map((task) => {
          const dueDateObj = new Date(task.dueDate);
          const dueDate = dueDateObj.toString();
          const dueTime = dueDateObj.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });

          return {
            ...task,
            dueDate: dueDate,
            dueTime: dueTime,
          };
        })}
        _time={new Date(assignment.dueDate).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
        assignmentId={assignment.id}
        children={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <EllipsisVertical className="ml-auto cursor-pointer" size={18} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                <DialogTrigger asChild>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                </DialogTrigger>

                <DropdownMenuItem
                  onClick={() => handleDelete(course.id, assignment.id)}
                >
                  Delete
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CopyButton
                    textToCopy={`Purpose: \n${
                      assignment.purpose
                    }\n\nInstructions: \n${
                      assignment.instructions
                    }\n\nGrading: \n${assignment.grading}\n\nSubmission: \n${
                      assignment.submission
                    }\n\nTasks:\n${assignment.tasks
                      .map((task) => {
                        return `- ${task.title}: ${task.description}`;
                      })
                      .join("\n")}`}
                    inactiveIcon={<div>Copy To Canvas</div>}
                    activeIcon={<div>Copied to Clipboard</div>}
                  />
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />
    </InstructorAccess>
  );
}
