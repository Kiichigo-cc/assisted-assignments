import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronRight } from "lucide-react";
import useAccessToken from "@/hooks/useAccessToken";
import { fetchAllCourses } from "../../api/courseApi";
import { useNavigate, useParams } from "react-router-dom";

export function CourseAssignmentSelector() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedAssignmentId, setSelectedAssignmentId] = useState("");
  const [availableAssignments, setAvailableAssignments] = useState([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [error, setError] = useState(null);
  const { accessToken } = useAccessToken();

  const navigate = useNavigate();
  const { courseId: urlCourseId, assignmentId: urlAssignmentId } = useParams();

  // Load all courses
  useEffect(() => {
    if (!accessToken) return;

    const loadCourses = async () => {
      setIsLoadingCourses(true);
      const result = await fetchAllCourses(accessToken);

      if (result.success) {
        setCourses(result.courses);
        setError(null);
      } else {
        setCourses([]);
        setError(result.error);
      }

      setIsLoadingCourses(false);
    };

    loadCourses();
  }, [accessToken]);

  // Handle course and assignment selection from URL
  useEffect(() => {
    if (!courses.length) return;

    const selectedCourse = courses.find(
      (c) => c.id === selectedCourseId || c.id === urlCourseId
    );

    if (selectedCourse) {
      setAvailableAssignments(selectedCourse.assignments || []);
      setSelectedCourseId(selectedCourse.id);

      const assignmentExists = selectedCourse.assignments?.some(
        (a) => a.id === parseInt(urlAssignmentId)
      );

      if (assignmentExists) {
        setSelectedAssignmentId(urlAssignmentId);
      } else {
        setSelectedAssignmentId("");
      }
    } else {
      setAvailableAssignments([]);
      setSelectedAssignmentId("");
    }
  }, [courses, urlCourseId, urlAssignmentId, selectedCourseId]);

  // Navigate when both selections are made
  useEffect(() => {
    if (selectedCourseId && selectedAssignmentId) {
      const currentUrl = `/reports/${selectedCourseId}/${selectedAssignmentId}`;
      const browserUrl = window.location.pathname;
      if (browserUrl !== currentUrl) {
        navigate(currentUrl);
      }
    }
  }, [selectedCourseId, selectedAssignmentId, navigate]);

  const getCourseName = (courseId) =>
    courses.find((c) => c.id === courseId)?.courseName || "";

  const getAssignmentName = (assignmentId) =>
    availableAssignments.find((a) => a.id === parseInt(assignmentId))?.name ||
    "";

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full">
            {/* Course Selector */}
            <div className="w-full md:w-64">
              <label className="text-sm font-medium block mb-1">Course</label>
              <Select
                value={selectedCourseId}
                onValueChange={setSelectedCourseId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingCourses ? (
                    <SelectItem disabled>Loading...</SelectItem>
                  ) : error ? (
                    <SelectItem disabled>Error loading courses</SelectItem>
                  ) : courses.length === 0 ? (
                    <SelectItem disabled>No courses available</SelectItem>
                  ) : (
                    courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.courseName}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Assignment Selector */}
            <div className="w-full md:w-64">
              <label className="text-sm font-medium block mb-1">
                Assignment
              </label>
              <Select
                value={selectedAssignmentId}
                onValueChange={setSelectedAssignmentId}
                disabled={
                  !selectedCourseId || availableAssignments.length === 0
                }
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      selectedCourseId
                        ? "Select an assignment"
                        : "Select a course first"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableAssignments.length > 0 ? (
                    availableAssignments.map((assignment) => (
                      <SelectItem
                        key={assignment.id}
                        value={assignment.id.toString()}
                      >
                        {assignment.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled>No assignments</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Mobile View Display */}
        {selectedCourseId && selectedAssignmentId && (
          <div className="md:hidden flex items-center text-sm text-slate-500 mt-4">
            <span>{getCourseName(selectedCourseId)}</span>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span>{getAssignmentName(selectedAssignmentId)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
