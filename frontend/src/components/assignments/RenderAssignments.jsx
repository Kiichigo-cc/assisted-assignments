import React, { useEffect, useState } from "react";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useAccessToken from "@/hooks/useAccessToken";

import { EllipsisVertical } from "lucide-react";
import AssignmentDialog from "./AssignmentForm";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { deleteAssignment, fetchAssignments } from "../../api/assignmentApi.js";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@radix-ui/react-dialog";
import InstructorAccess from "../user-permissions/InstructorAccess";

export function RenderAssignments({ course }) {
  const { accessToken } = useAccessToken();
  const [assignments, setAssignments] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const updateAssignments = (a) => {
    setAssignments(a);
  };

  const handleDelete = async (courseId, assignmentId) => {
    try {
      const { success, assignments, message } = await deleteAssignment(
        courseId,
        assignmentId,
        accessToken
      );

      if (success) {
        setAssignments(assignments); // Update state with remaining assignments
        toast("Assignment and tasks deleted successfully");
      } else {
        toast(`Failed to delete: ${message}`);
      }
    } catch (error) {
      toast(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      const { success, assignments, message } = await fetchAssignments(
        course.id,
        accessToken
      );

      if (success) {
        setAssignments(assignments);
      } else {
        console.error(message);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [accessToken]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="mt-8">
      <div className="flex flex-row items-center">
        <h2 className="text-2xl font-semibold">Assignments</h2>
        <InstructorAccess>
          <AssignmentDialog
            updateAssignments={updateAssignments}
            children={
              <DialogTrigger asChild>
                <Button className="ml-auto">+ Add Assignment</Button>
              </DialogTrigger>
            }
          />
        </InstructorAccess>
      </div>
      <div className="flex flex-col space-y-4 mt-4">
        {assignments?.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate)).map((assignment) => (
          <Card key={assignment.id} in>
            <div className="flex flex-row items-center py-2 px-4">
              <div>
                <Link to={`/courses/${course.id}/${assignment.id}`}>
                  <CardTitle className="text-[16px] hover:underline">
                    {assignment.name}
                  </CardTitle>
                </Link>
                <CardDescription className="text-[14px]">
                  {assignment.points} pts | Due{" "}
                  {new Date(assignment.dueDate).toLocaleString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </CardDescription>
              </div>
              <AssignmentDialog
                updateAssignments={updateAssignments}
                _date={new Date(assignment.dueDate).toString()}
                _name={assignment.name}
                _points={assignment.points}
                _purpose={assignment.purpose}
                _instructions={assignment.instructions}
                _grading={assignment.grading}
                _submission={assignment.submission}
                _tasks={assignment.tasks.map(task => {
                  const dueDateObj = new Date(task.dueDate);
                  const dueDate = dueDateObj.toString();
                  const dueTime = dueDateObj.toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })
                  
                  return {
                    ...task,
                    dueDate: dueDate,
                    dueTime: dueTime,
                  };
                })}
                _time={new Date(assignment.dueDate).toLocaleTimeString(
                  "en-GB",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  }
                )}
                assignmentId={assignment.id}
                children={
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <EllipsisVertical
                        className="ml-auto cursor-pointer"
                        size={18}
                      />
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
                        <DropdownMenuItem>Copy to Canvas</DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                }
              />
            </div>
            <div>
              {assignment?.tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).map((task) => (
                <div
                  key={task.id}
                  className="border-t px-4 py-2 radius-0 rounded-none bg-secondary/40"
                >
                  <Link
                    to={`/courses/${course.id}/${assignment.id}/${task.id}`}
                  >
                    <CardTitle className="text-[16px] hover:underline">
                      {task.title}
                    </CardTitle>
                  </Link>
                  <CardDescription>
                    {task.points} pts | Due:{" "}
                    {new Date(task.dueDate).toLocaleString("en-US", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </CardDescription>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default RenderAssignments;
