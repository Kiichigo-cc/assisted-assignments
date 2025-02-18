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

export function RenderAssignments({ course }) {
  const { accessToken, scopes } = useAccessToken();
  const [assignments, setAssignments] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const updateAssignments = (a) => {
    setAssignments(a);
  };

  const handleDelete = async (courseId, assignmentId) => {
    try {
      const response = await fetch(
        `http://localhost:5001/assignments/${courseId}/${assignmentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data.assignments);
        setAssignments(data.assignments);
        toast("Assignment and tasks deleted successfully");
      } else {
        const error = await response.json();
        toast(`Failed to delete: ${error.message}`);
      }
    } catch (error) {
      toast(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!accessToken) {
        return;
      }
      try {
        const response = await fetch(
          `http://localhost:5001/assignments/${course.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setIsLoading(false);
          setAssignments(data);
        } else {
          setIsLoading(false);
          console.error("Failed to fetch courses");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchAssignments();
  }, [accessToken]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="mt-8">
      <div className="flex flex-row items-center">
        <h2 className="text-2xl font-semibold">Assignments</h2>
        {scopes?.length === 0 || !scopes ? null : (
          <AssignmentDialog updateAssignments={updateAssignments} />
        )}
      </div>
      <div className="flex flex-col space-y-4 mt-4">
        {assignments?.map((assignment) => (
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <EllipsisVertical
                    className="ml-auto cursor-pointer"
                    size={18}
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(course.id, assignment.id)}
                    >
                      Delete
                    </DropdownMenuItem>
                    <DropdownMenuItem>Copy to Canvas</DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div>
              {assignment?.tasks.map((task) => (
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
