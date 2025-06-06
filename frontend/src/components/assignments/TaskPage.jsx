import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useAccessToken from "@/hooks/useAccessToken";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { fetchAssignmentTask } from "../../api/AssignmentApi";
import useBreadcrumbStore from "../../hooks/useBreadcrumbStore.js";

// TaskPage component that displays details of a specific assignment task
const TaskPage = () => {
  const { courseId, assignmentId, taskId } = useParams(); // Get assignment ID from URL params
  const [taskData, setTaskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { accessToken } = useAccessToken();
  const setBreadcrumbs = useBreadcrumbStore((state) => state.setBreadcrumbs);

  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) {
        return;
      }

      const { success, data, message } = await fetchAssignmentTask(
        courseId,
        assignmentId,
        taskId,
        accessToken
      );

      if (success) {
        setTaskData(data);
        setBreadcrumbs(
          courseId,
          data.assignment.course.courseName,
          assignmentId,
          data.assignment.name,
          taskId,
          data.title
        );
      } else {
        setError(message);
      }
      setLoading(false);
    };

    fetchData();
  }, [courseId, assignmentId, taskId, accessToken]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{taskData.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {taskData ? (
          <div className="space-y-2">
            {/* <strong>Points:</strong> {taskData.points} | <strong>Due:</strong>{" "}
            {new Date(taskData.dueDate).toLocaleString("en-US", {
              month: "2-digit",
              day: "2-digit",
              year: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })} */}
            <Separator className="mt-2" />
            <div>{taskData.description}</div>
          </div>
        ) : (
          <p>No assignment data available.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskPage;
