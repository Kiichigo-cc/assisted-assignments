import React, { useEffect, useState } from "react";

import { Card, CardTitle } from "@/components/ui/card";
import useAccessToken from "@/hooks/useAccessToken";
import AssignmentDialog from "./AssignmentForm";
import { Link } from "react-router-dom";
import { fetchAssignments } from "../../api/AssignmentApi";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@radix-ui/react-dialog";
import InstructorAccess from "../user-permissions/InstructorAccess";
import AssignmentDropdown from "./AssignmentDropdown";

export function RenderAssignments({ course }) {
  const { accessToken } = useAccessToken();
  const [assignments, setAssignments] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const updateAssignments = (a) => {
    setAssignments(a);
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
      <div className="flex sm:flex-row flex-col sm:items-center sm:justify-between justify-start gap-2">
        <h2 className="text-2xl font-semibold">Assignments</h2>
        <InstructorAccess>
          <AssignmentDialog
            updateAssignments={updateAssignments}
            children={
              <DialogTrigger asChild>
                <Button className="">+ Add Assignment</Button>
              </DialogTrigger>
            }
          />
        </InstructorAccess>
      </div>
      <div className="flex flex-col space-y-4 mt-4">
        {assignments
          ?.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))
          .map((assignment) => (
            <Card key={assignment.id} in>
              <div className="flex flex-row items-center py-2 px-4">
                <div>
                  <Link to={`/courses/${course.id}/${assignment.id}`}>
                    <CardTitle className="text-[16px] hover:underline">
                      {assignment.name}
                    </CardTitle>
                  </Link>
                  {/* <CardDescription className="text-[14px]">
                    {assignment.points} pts | Due{" "}
                    {new Date(assignment.dueDate).toLocaleString("en-US", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </CardDescription> */}
                </div>
                <AssignmentDropdown
                  assignment={assignment}
                  course={course}
                  updateAssignments={updateAssignments}
                />
              </div>
              <div>
                {assignment?.tasks
                  .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                  .map((task) => (
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
                      {/* <CardDescription>
                        {task.points} pts | Due:{" "}
                        {new Date(task.dueDate).toLocaleString("en-US", {
                          month: "2-digit",
                          day: "2-digit",
                          year: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </CardDescription> */}
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
