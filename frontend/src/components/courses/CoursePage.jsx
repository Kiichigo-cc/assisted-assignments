import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

export function CoursePage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const { accessToken, scopes } = useAccessToken();
  const [enrolledUsers, setEnrolledUsers] = useState(null);
  const [inviteCode, setInviteCode] = useState(""); // Store invite code

  useEffect(() => {
    if (!accessToken) {
      return;
    }
    const fetchCourseDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/courses/${courseId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const data = await response.json();
        setCourse(data.course);
        setEnrolledUsers(data.users);
        setLoading(false);
      } catch (err) {
        setError("Course not found or error fetching data");
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId, accessToken]);

  const generateInviteCode = async () => {
    try {
      const response = await fetch(
        "http://localhost:5001/generate-access-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ courseId }), // Pass the courseId
        }
      );

      const data = await response.json();

      if (response.ok) {
        setInviteCode(data.accessCode); // Set the generated invite code
      } else {
        console.log("error");
      }
    } catch (err) {
      console.log("error");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return course ? (
    <Card className="border-none shadow-none w-full">
      <CardHeader>
        <div className="flex flex-row items-center">
          <CardTitle>
            {course.courseNumber} - {course.courseName} {`(${course.term})`}
          </CardTitle>
          {scopes?.length === 0 || !scopes ? null : (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="ml-auto" onClick={generateInviteCode}>
                  Invite Code
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Share Invite Code</DialogTitle>
                  <DialogDescription>
                    This code will last for 10 Minutes before expiring.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                  <div className="grid flex-1 gap-2">
                    <Label htmlFor="link" className="sr-only">
                      Link
                    </Label>
                    <Input id="link" value={inviteCode || ""} readOnly />
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
          )}
        </div>
        <CardDescription>Placeholder for description</CardDescription>
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
