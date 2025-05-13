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
import { fetchAssignmentData } from "../../api/AssignmentApi";
import { Button } from "@/components/ui/button";
import { ChartBar, MessageCircle } from "lucide-react";
import useBreadcrumbStore from "../../hooks/useBreadcrumbStore.js";
import { useNavigate } from "react-router-dom";
import AssignmentDropdown from "./AssignmentDropdown";

const AssignmentPage = () => {
  const { courseId, assignmentId } = useParams();
  const [assignmentData, setAssignmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { accessToken } = useAccessToken();
  const setBreadcrumbs = useBreadcrumbStore((state) => state.setBreadcrumbs);

  const updateAssignments = (a) => {
    const found = a.find(
      (assignment) => assignment.id === parseInt(assignmentId)
    );
    setAssignmentData(found);
  };
  useEffect(() => {
    if (!accessToken) {
      //setError("Access token is missing");
      //setLoading(false);
      return;
    }

    const getAssignmentData = async () => {
      try {
        const data = await fetchAssignmentData(
          courseId,
          assignmentId,
          accessToken
        );
        setAssignmentData(data);
        setBreadcrumbs(
          courseId,
          data.course.courseName,
          assignmentId,
          data.name,
          null,
          ""
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getAssignmentData();
  }, [courseId, assignmentId, accessToken]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-col">
        <div className="flex flex-row justify-between">
          <CardTitle>{assignmentData.name}</CardTitle>
          <AssignmentDropdown
            assignment={assignmentData}
            course={assignmentData.course}
            updateAssignments={updateAssignments}
          />
        </div>
        <div className="py-2 space-x-2 flex flex-row">
          <Link to={`/chatbot?assignmentId=${assignmentData.id}`}>
            <Button>
              <MessageCircle className="mr-2" />
              Ask Chatbot
            </Button>
          </Link>
          <Link to={`/reports/${courseId}/${assignmentId}`}>
            <Button variant="outline">
              <ChartBar />
              View Student Metrics
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {assignmentData ? (
          <div className="space-y-2">
            {/* <div>
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
            </div> */}
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
