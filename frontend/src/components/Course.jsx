import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
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
import { Link, useParams } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { EllipsisVertical } from "lucide-react";

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

export function CourseCard({ name, courseNumber, term, courseId }) {
  return (
    <Link to={`/courses/${courseId}`} className="block">
      <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row">
          <div>
            <CardTitle>
              {courseNumber} - {name}
            </CardTitle>
            <CardDescription>
              Term: <span className="font-medium">{term}</span>
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <EllipsisVertical className="ml-auto cursor-pointer" size={18} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
      </Card>
    </Link>
  );
}

export default function Courses() {
  const [courseName, setCourseName] = useState("");
  const [courseId, setCourseId] = useState("");
  const [term, setTerm] = useState("");

  const handleSubmit = () => {
    console.log("Course Added:", { courseName, courseId, term });
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
  ];

  //fetch here
  const courseList = [
    {
      name: "Introduction to Programming",
      courseNumber: "CS101",
      term: "Fall 2025",
      courseId: "1234567890",
    },
    {
      name: "Data Structures",
      courseNumber: "CS102",
      term: "Spring 2025",
      courseId: "9876543210",
    },
  ];

  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader className="flex flex-row items-center">
        <CardTitle>Courses</CardTitle>
        <DialogButton
          buttonLabel={"+ Add Course"}
          dialogTitle={"Add Course"}
          inputs={inputs}
          onSubmit={handleSubmit}
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {courseList.map((course) => (
            <CourseCard
              key={course.courseId}
              name={course.name}
              courseNumber={course.courseNumber}
              term={course.term}
              courseId={course.courseId}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function CoursePage() {
  const { courseId } = useParams();

  const courseDetails = {
    1234567890: {
      name: "Introduction to Programming",
      courseNumber: "CS101",
      description: "A beginner's course in programming.",
      assignments: [
        {
          id: 1,
          title: "Assignment 1: Introduction to Variables",
          description:
            "This assignment will introduce you to variables and their usage.",
          totalPoints: 100,
          tasks: [
            {
              id: 1,
              subtitle: "Task 1: Declare Variables",
              description:
                "Write a program that declares variables of different types.",
              dueDate: "2025-02-15",
              points: 50,
            },
            {
              id: 2,
              subtitle: "Task 2: Print Variables",
              description:
                "Write a program that prints the values of the declared variables.",
              dueDate: "2025-02-20",
              points: 50,
            },
          ],
        },
        {
          id: 2,
          title: "Assignment 2: Loops and Conditionals",
          description:
            "Learn how to use loops and conditionals in programming.",
          totalPoints: 100,
          tasks: [
            {
              id: 1,
              subtitle: "Task 1: Write a Loop",
              description:
                "Write a program that uses a for loop to iterate over an array.",
              dueDate: "2025-03-01",
              points: 60,
            },
            {
              id: 2,
              subtitle: "Task 2: Conditional Statements",
              description:
                "Write a program that uses if-else statements to check conditions.",
              dueDate: "2025-03-05",
              points: 40,
            },
          ],
        },
      ],
    },
    9876543210: {
      name: "Data Structures",
      courseNumber: "CS102",
      description: "Learn about various data structures.",
      assignments: [
        {
          id: 1,
          title: "Assignment 1: Arrays",
          description: "Understand how arrays work and their basic operations.",
          totalPoints: 100,
          tasks: [
            {
              id: 1,
              subtitle: "Task 1: Implement an Array",
              description:
                "Write a program to create and manipulate an array of integers.",
              dueDate: "2025-02-20",
              points: 60,
            },
            {
              id: 2,
              subtitle: "Task 2: Array Sorting",
              description:
                "Write a program to sort an array using a sorting algorithm.",
              dueDate: "2025-02-25",
              points: 40,
            },
          ],
        },
      ],
    },
  };

  const course = courseDetails[courseId];

  if (!course) {
    return <p>Course not found.</p>;
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>
          {course.courseNumber} - {course.name}
        </CardTitle>
        <CardDescription>{course.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mt-8">
          <div className="flex flex-row items-center">
            <h2 className="text-2xl font-semibold">Assignments</h2>
            <DialogButton
              buttonLabel={"+ Add Assignment"}
              dialogTitle={"Add Assignment"}
              inputs={[]}
              onSubmit={() => {}}
            />
          </div>
          <div className="flex flex-col space-y-4 mt-4">
            {course.assignments.map((assignment) => (
              <Card key={assignment.id}>
                <div className="flex flex-row items-center py-2 px-4">
                  <div>
                    <CardTitle className="text-[16px]">
                      {assignment.title}
                    </CardTitle>
                    <CardDescription className="text-[14px]">
                      {assignment.totalPoints} pts | Due{" "}
                      {assignment.tasks[assignment.tasks.length - 1].dueDate}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <EllipsisVertical
                        className="ml-auto cursor-pointer"
                        size={18}
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuGroup>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                        <DropdownMenuItem>Copy to Canvas</DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div>
                  {assignment.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="border-t px-4 py-2 radius-0 rounded-none bg-secondary/40"
                    >
                      <CardTitle className="text-[16px]">
                        {task.subtitle}
                      </CardTitle>
                      <CardDescription>
                        {task.points} pts | Due: {task.dueDate}
                      </CardDescription>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
