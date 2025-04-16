import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams } from "react-router-dom";
import useAccessToken from "@/hooks/useAccessToken";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { X } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { createAssignment, updateAssignment } from "../../api/AssignmentApi";

const AssignmentDialog = ({
  updateAssignments,
  _tasks = [],
  _points = 0,
  _name = "",
  _promptInstructions = "",
  _purpose = "",
  _instructions = "",
  _submission = "",
  _grading = "",
  _date = null,
  _time = "",
  _open = false,
  assignmentId = null,
  children,
}) => {
  const { courseId } = useParams();
  const [tasks, setTasks] = useState(_tasks);
  const [points, setPoints] = useState(_points);
  const [name, setName] = useState(_name);
  const [promptInstructions, setPromptInstructions] =
    useState(_promptInstructions);
  const [purpose, setPurpose] = useState(_purpose);
  const [instructions, setInstructions] = useState(_instructions);
  const [submission, setSubmission] = useState(_submission);
  const [grading, setGrading] = useState(_grading);
  const [date, setDate] = useState(_date);
  const [time, setTime] = useState(_time);
  const { accessToken } = useAccessToken();
  const [open, setOpen] = React.useState(_open);
  const handleTaskChange = (index, field, value) => {
    const newTasks = [...tasks];
    newTasks[index][field] = value;
    setTasks(newTasks);
  };

  const handleAddTask = () => {
    setTasks([
      ...tasks,
      { title: "", description: "", points: "", dueDate: "", dueTime: "" },
    ]);
  };

  const handleRemoveTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const combineDateAndTime = (date, time) => {
    if (!date || !time) return null;
    const combinedDateTime = new Date(`${format(date, "yyyy-MM-dd")}T${time}`);
    return combinedDateTime;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Combine the date and time for each task
    const updatedTasks = tasks?.map((task) => {
      const combinedDueDateTime = combineDateAndTime(
        task.dueDate,
        task.dueTime
      );
      return {
        ...task,
        dueDate: combinedDueDateTime, // Store the combined datetime in `dueDate`
      };
    });

    const formData = {
      name,
      promptInstructions,
      purpose,
      instructions,
      submission,
      grading,
      points,
      dueDate: combineDateAndTime(date, time), // Combine date and time here
      tasks: updatedTasks, // Use updated tasks with combined dueDate and dueTime
    };

    try {
      let data;

      if (assignmentId) {
        data = await updateAssignment(
          courseId,
          assignmentId,
          accessToken,
          formData
        );
      } else {
        data = await createAssignment(courseId, accessToken, formData);
      }

      setOpen(false);
      updateAssignments(data);
    } catch (error) {
      console.error("Error creating assignment and tasks:", error);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children}
      <DialogContent className="sm:max-w-[925px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>
            {assignmentId ? "Edit Assignment" : "Add Assignment"}
          </DialogTitle>
        </DialogHeader>
        <div>
          <div className="">
            <div className="space-y-2">
              <div>
                <Label htmlFor="name" className="text-right">
                  Assignment Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div>
                <Label htmlFor="purpose" className="text-right">
                  Purpose
                </Label>
                <Textarea
                  id="purpose"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div>
                <Label htmlFor="instructions" className="text-right">
                  Instructions
                </Label>
                <Textarea
                  id="instructions"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div>
                <Label htmlFor="submission" className="text-right">
                  Submission Details
                </Label>
                <Textarea
                  id="submission"
                  value={submission}
                  onChange={(e) => setSubmission(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div>
                <Label htmlFor="grading" className="text-right">
                  Grading Criteria
                </Label>
                <Textarea
                  id="grading"
                  value={grading}
                  onChange={(e) => setGrading(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div>
                <Label htmlFor="grading" className="text-right">
                  Chatbot Prompt Instructions
                </Label>
                <Textarea
                  id="grading"
                  value={promptInstructions}
                  onChange={(e) => setPromptInstructions(e.target.value)}
                  className="col-span-3"
                />
              </div>
              {/* <div>
                <Label htmlFor="points" className="text-right">
                  Points
                </Label>
                <Input
                  id="points"
                  type="number"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="flex flex-col">
                <Label htmlFor="due" className="py-1">
                  Due Date
                </Label>
                <div className="flex flex-row items-center space-x-2">
                  <Popover id="due">
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      className="flex w-auto flex-col space-y-2 p-2"
                    >
                      <Select
                        onValueChange={(value) =>
                          setDate(addDays(new Date(), parseInt(value)))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="0">Today</SelectItem>
                          <SelectItem value="1">Tomorrow</SelectItem>
                          <SelectItem value="3">In 3 days</SelectItem>
                          <SelectItem value="7">In a week</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="rounded-md border">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Input
                    type="time"
                    id="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="border rounded-md w-32"
                  />
                </div>
              </div> */}
              <div className="col-span-3 py-4">
                <Button variant="secondary" onClick={handleAddTask}>
                  + Add Task
                </Button>
              </div>
            </div>

            {/* Task Fields */}
            <div className="grid grid-cols-2 gap-4">
              {tasks?.map((task, index) => (
                <Card key={index} className="">
                  <CardHeader className="flex flex-row items-center">
                    <CardTitle>Task</CardTitle>
                    <Button
                      variant="secondary"
                      className="ml-auto h-[30px] w-[30px] right-0"
                      size="icon"
                      onClick={() => handleRemoveTask(index)}
                    >
                      <X />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label
                        htmlFor={`task-title-${index}`}
                        className="text-right"
                      >
                        Task Name
                      </Label>
                      <Input
                        id={`task-title-${index}`}
                        value={task.title}
                        onChange={(e) =>
                          handleTaskChange(index, "title", e.target.value)
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor={`task-description-${index}`}
                        className="text-right"
                      >
                        Task Description
                      </Label>
                      <Textarea
                        id={`task-description-${index}`}
                        value={task.description}
                        onChange={(e) =>
                          handleTaskChange(index, "description", e.target.value)
                        }
                        className="col-span-3"
                      />
                    </div>
                    {/* <div>
                      <Label
                        htmlFor={`task-points-${index}`}
                        className="text-right"
                      >
                        Task Points
                      </Label>
                      <Input
                        id={`task-points-${index}`}
                        type="number"
                        value={task.points}
                        onChange={(e) =>
                          handleTaskChange(index, "points", e.target.value)
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="flex flex-col">
                      <Label htmlFor={`task-dueDate-${index}`} className="py-1">
                        Task Due Date
                      </Label>
                      <div className="flex flex-row space-x-2">
                        <Popover id={`task-dueDate-${index}`}>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] justify-start text-left font-normal",
                                !task.dueDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon />
                              {task.dueDate ? (
                                format(task.dueDate, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            align="start"
                            className="flex w-auto flex-col space-y-2 p-2"
                          >
                            <Select
                              onValueChange={(value) =>
                                handleTaskChange(
                                  index,
                                  "dueDate",
                                  addDays(new Date(), parseInt(value))
                                )
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent position="popper">
                                <SelectItem value="0">Today</SelectItem>
                                <SelectItem value="1">Tomorrow</SelectItem>
                                <SelectItem value="3">In 3 days</SelectItem>
                                <SelectItem value="7">In a week</SelectItem>
                              </SelectContent>
                            </Select>
                            <div className="rounded-md border">
                              <Calendar
                                mode="single"
                                selected={task.dueDate}
                                onSelect={(date) =>
                                  handleTaskChange(index, "dueDate", date)
                                }
                              />
                            </div>
                          </PopoverContent>
                        </Popover>
                        <Input
                          type="time"
                          id={`task-time-${index}`}
                          value={task.dueTime}
                          onChange={(e) =>
                            handleTaskChange(index, "dueTime", e.target.value)
                          }
                          className="border p-2 rounded-md"
                        />
                      </div>
                    </div> */}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignmentDialog;
