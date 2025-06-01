import { Link, useLocation } from "react-router-dom"; // Use Link from react-router-dom
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import useBreadcrumbStore from "../hooks/useBreadcrumbStore";

// DynamicBreadcrumb component that generates breadcrumbs based on the current route and Zustand store values
function DynamicBreadcrumb() {
  // Get breadcrumb values from the Zustand store

  const location = useLocation();
  const {
    courseId,
    courseTitle,
    assignmentId,
    assignmentTitle,
    taskId,
    taskTitle,
  } = useBreadcrumbStore((state) => state);

  // Dynamically generate the breadcrumbs
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Always show the "Courses" breadcrumb */}
        {location.pathname === "/" || location.pathname.includes("courses") ? (
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/courses">Courses</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        ) : null}
        {location.pathname.includes("chatbot") ? (
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/courses">Chatbot</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        ) : null}
        {location.pathname.includes("chatlogs") ? (
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/courses">Chat Logs</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        ) : null}
        {location.pathname.includes("settings") ? (
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/courses">Settings</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        ) : null}
        {location.pathname.includes("reports") ? (
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/reports">Reports</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        ) : null}

        {/* If there's a courseId, display the course breadcrumb */}
        {courseId && courseTitle ? (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={`/courses/${courseId}`}>
                  {/* Shorten the course title if there's an assignment or task */}
                  {assignmentId || taskId
                    ? `${courseTitle.slice(0, 10)}...`
                    : courseTitle}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        ) : null}

        {/* If there's an assignmentId, display the assignment breadcrumb */}
        {assignmentId && assignmentTitle ? (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={`/courses/${courseId}/${assignmentId}`}>
                  {/* Shorten the assignment title if there's a task */}
                  {taskId
                    ? `${assignmentTitle.slice(0, 10)}...`
                    : assignmentTitle}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        ) : null}

        {/* If there's a taskId, display the task breadcrumb */}
        {taskId ? (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={`/courses/${courseId}/${assignmentId}/${taskId}`}>
                  {taskTitle || taskId}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        ) : null}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default DynamicBreadcrumb;
