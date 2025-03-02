import React, { useEffect, useState } from "react";

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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import useAccessToken from "@/hooks/useAccessToken";

import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "sonner";
import { createCourse, joinCourse } from "../../api/courseApi";

export function DialogButton({
  buttonLabel,
  dialogTitle,
  inputs = [],
  onSubmit,
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="ml-auto">{buttonLabel}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2 py-4">
          {inputs.map((input, index) => (
            <div key={index}>
              <Label htmlFor={input.id} className="text-left">
                {input.label}
              </Label>
              <Input
                id={input.id}
                value={input.value}
                onChange={input.onChange}
                className="col-span-3"
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={onSubmit} type="submit">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [courseId, setCourseId] = useState("");
  const [term, setTerm] = useState("");
  const [courseNumber, setCourseNumber] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { accessToken, scopes } = useAccessToken();
  const { user } = useAuth0();
  const [accessCode, setAccessCode] = useState(""); // State for the input field
  const [open, setOpen] = useState(false);
  const [openCourseForm, setOpenCourseForm] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!accessToken) {
        return;
      }
      try {
        const response = await fetch("http://localhost:5001/courses", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setIsLoading(false);
          setCourses(data); // Update the state with the fetched courses
        } else {
          setIsLoading(false);
          console.error("Failed to fetch courses");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [accessToken, open]);

  const handleSubmit = async () => {
    const newCourse = { courseName, courseId, term, courseNumber };
    setOpenCourseForm(false); // Close the form

    const { success, addedCourse, message } = await createCourse(
      newCourse,
      user,
      accessToken
    );

    if (success) {
      setCourses([...courses, addedCourse]); // Update the courses state with the new course
      // Clear the form after submission
      setCourseName("");
      setCourseId("");
      setTerm("");
      setCourseNumber("");
    } else {
      console.error(message); // Handle error if course creation failed
    }
  };

  const inputs = [
    {
      id: "courseName",
      label: "Course Name",
      value: courseName,
      onChange: (e) => setCourseName(e.target.value),
    },
    {
      id: "courseId",
      label: "Course ID",
      value: courseId,
      onChange: (e) => setCourseId(e.target.value),
    },
    {
      id: "term",
      label: "Term",
      value: term,
      onChange: (e) => setTerm(e.target.value),
    },
    {
      id: "courseNumber",
      label: "Course Number",
      value: courseNumber,
      onChange: (e) => setCourseNumber(e.target.value),
    },
  ];

  const handleJoinCourse = async () => {
    const { success, message } = await joinCourse(
      accessCode,
      user,
      accessToken
    );

    if (success) {
      toast(message);
      setOpen(false); // Close the form
    } else {
      toast(message);
    }
  };

  const renderCourses = () => {
    return isLoading ? (
      <div>Loading</div>
    ) : (
      courses.map((course) => (
        <Link to={`/courses/${course.id}`} key={course.id} className="block">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>
                {course.courseNumber} - {course.courseName}
              </CardTitle>
              <CardDescription>Term: {course.term}</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))
    );
  };

  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader className="flex flex-row items-center">
        <CardTitle>Courses</CardTitle>
        <div className="ml-auto space-x-2">
          {scopes?.length === 0 || !scopes ? null : (
            <Dialog open={openCourseForm} onOpenChange={setOpenCourseForm}>
              <DialogTrigger asChild>
                <Button className="ml-auto">+ Add Course</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Course</DialogTitle>
                </DialogHeader>
                <div className="grid gap-2 py-4">
                  {inputs.map((input, index) => (
                    <div key={index}>
                      <Label htmlFor={input.id} className="text-left">
                        {input.label}
                      </Label>
                      <Input
                        id={input.id}
                        value={input.value}
                        onChange={input.onChange}
                        className="col-span-3"
                      />
                    </div>
                  ))}
                </div>
                <DialogFooter>
                  <Button onClick={handleSubmit} type="submit">
                    Save changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="ml-auto">Join a Course</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Join Course</DialogTitle>
                <DialogDescription>
                  Enter the access code provided by the instructor to join a
                  course.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-2 py-4">
                <div>
                  <Input
                    id="join"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleJoinCourse} type="submit">
                  Join
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">{renderCourses()}</div>
      </CardContent>
    </Card>
  );
}
