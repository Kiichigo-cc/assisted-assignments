import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import useAccessToken from "@/hooks/useAccessToken";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const AssignmentPage = () => {
  const { courseId, assignmentId } = useParams();
  const [assignmentData, setAssignmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { accessToken } = useAccessToken();

  useEffect(() => {
    const fetchAssignmentData = async () => {
      if (!accessToken) {
        return;
      }
      try {
        const response = await fetch(
          `http://localhost:5001/assignments/${courseId}/${assignmentId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Assignment not found");
        }

        const data = await response.json();
        setAssignmentData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignmentData();
  }, [courseId, assignmentId, accessToken]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{assignmentData.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {assignmentData ? (
          <div className="space-y-2">
            <div>
              <div>
                <strong>Points:</strong> {assignmentData.points} |{" "}
                <strong>Due:</strong>{" "}
                {new Date(assignmentData.dueDate).toLocaleString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </div>
              <Separator className="mt-2" />
            </div>
            <div>
              <div className="text-[20px] font-semibold">Purpose</div>
              <div>{assignmentData.purpose || "N/A"}</div>
              <Separator className="mt-2" />
            </div>
            <div>
              <div className="text-[20px] font-semibold">Instructions</div>
              <div>{assignmentData.instructions || "N/A"}</div>
              <Separator className="mt-2" />
            </div>
            <div>
              <div className="text-[20px] font-semibold">
                Submission Details
              </div>
              <div>{assignmentData.submission || "N/A"}</div>
              <Separator className="mt-2" />
            </div>
            <div>
              <div className="text-[20px] font-semibold">Grading Critera</div>
              <div>{assignmentData.grading || "N/A"}</div>
            </div>

            {assignmentData.tasks && assignmentData.tasks.length > 0 ? (
              <div className="pt-8">
                <div className="text-[20px] font-semibold">Tasks</div>

                <ul>
                  {assignmentData.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="border-t px-4 py-2 radius-0 rounded-none"
                    >
                      <Link
                        to={`/courses/${courseId}/${assignmentId}/${task.id}`}
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
                </ul>
              </div>
            ) : (
              <p>No tasks available.</p>
            )}
          </div>
        ) : (
          <p>No assignment data available.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AssignmentPage;
