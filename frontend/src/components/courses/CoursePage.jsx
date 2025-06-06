import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams } from "react-router-dom";
import useAccessToken from "@/hooks/useAccessToken";

import EnrolledUsers from "../EnrolledUsers";
import { RenderAssignments } from "../assignments/RenderAssignments";
import { fetchCourse } from "../../api/courseApi";
import useBreadcrumbStore from "../../hooks/useBreadcrumbStore.js";
import InstructorAccess from "../user-permissions/InstructorAccess";

// Main component for displaying course details, assignments, and enrolled users
export function CoursePage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const { accessToken } = useAccessToken();
  const [enrolledUsers, setEnrolledUsers] = useState(null);

  const setBreadcrumbs = useBreadcrumbStore((state) => state.setBreadcrumbs);

  useEffect(() => {
    const getCourseDetails = async () => {
      const result = await fetchCourse(courseId, accessToken);
      if (result.success) {
        setCourse(result.course);
        setEnrolledUsers(result.users);
        setBreadcrumbs(courseId, result.course.courseName, null, "", null, ""); // Set breadcrumbs for the course page
        setLoading(false);
      } else {
        console.error(result.error);
        setLoading(false);
      }
    };
    if (accessToken) {
      getCourseDetails();
    }
  }, [courseId, accessToken]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return course ? (
    <Card className="border-none shadow-none w-full">
      <CardHeader>
        <div className="flex sm:flex-row flex-col sm:items-center sm:justify-between justify-start gap-2">
          <CardTitle>
            {course.courseNumber} - {course.courseName} {`(${course.term})`}
          </CardTitle>
          <InstructorAccess>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="">Invite Code</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Share Invite Code</DialogTitle>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                  <div className="grid flex-1 gap-2">
                    <Label htmlFor="link" className="sr-only">
                      Link
                    </Label>
                    <Input id="link" value={course.id || ""} readOnly />
                  </div>
                </div>
                <DialogFooter className="sm:justify-start">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Close
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </InstructorAccess>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="assignments" className="w-[100%]">
          <TabsList>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="people">People</TabsTrigger>
          </TabsList>
          <TabsContent value="assignments">
            <RenderAssignments course={course} />
          </TabsContent>
          <TabsContent value="people">
            <EnrolledUsers users={enrolledUsers} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  ) : (
    <div>Course Not Found</div>
  );
}

export default CoursePage;
