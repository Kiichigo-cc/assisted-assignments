import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMetricsAndIssues } from "../../api/reportApi";
import { DashboardHeader } from "./DashboardHeader";
import { StudentTable } from "./StudentTable";
import { IssuesReport } from "./IssuesReport";
import { CourseAssignmentSelector } from "./CourseSelector";
import useAccessToken from "@/hooks/useAccessToken";
import InstructorAccess from "../user-permissions/InstructorAccess";
import useBreadcrumbStore from "../../hooks/useBreadcrumbStore.js";

export default function ReportDashboard() {
  const { courseId, assignmentId } = useParams();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [assignment, setAssignment] = useState(null);
  const { accessToken } = useAccessToken();
  const setBreadcrumbs = useBreadcrumbStore((state) => state.setBreadcrumbs);

  useEffect(() => {
    const fetchMetricsAndIssues = async () => {
      if (!accessToken || !courseId || !assignmentId) return;

      setLoading(true);
      const result = await getMetricsAndIssues(
        courseId,
        assignmentId,
        accessToken
      );

      if (result.success) {
        setMetrics(result.data.metrics);
        setAssignment(result.data.assignment);
        setBreadcrumbs(
          courseId,
          null,
          result.data.assignment.id,
          result.data.assignment.name,
          null,
          ""
        );
      } else {
        console.error("Failed to fetch metrics and issues:", result.message);
        setMetrics(null);
        setAssignment(null);
      }
      setLoading(false);
    };

    fetchMetricsAndIssues();
  }, [courseId, assignmentId, accessToken]);

  return (
    <InstructorAccess>
      <div className="mx-auto">
        <CourseAssignmentSelector />
        {!courseId || !assignmentId ? (
          <div className="text-center text-muted-foreground mt-6">
            Please select a course and assignment to view the report.
          </div>
        ) : loading ? (
          <div className="text-center mt-6">Loading...</div>
        ) : metrics ? (
          <>
            <DashboardHeader studentsData={metrics} assignment={assignment} />
            <div className="grid gap-6">
              <StudentTable
                studentsData={metrics}
                accessToken={accessToken}
                assignment={assignment}
              />
              <div className="grid md:grid-cols-1 gap-6">
                <IssuesReport studentsData={metrics} />
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-red-500 mt-6">
            No metrics available for this assignment.
          </div>
        )}
      </div>
    </InstructorAccess>
  );
}
