import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams } from "react-router-dom";
import useAccessToken from "@/hooks/useAccessToken";
import { format } from "date-fns";

import { X } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { createAssignment, updateAssignment } from "../../api/AssignmentApi";

// FormField component to handle different input types
const FormField = ({
  id,
  value,
  onChange,
  label,
  type = "text",
  className,
  component: Component = Input,
}) => (
  <div>
    <Label htmlFor={id} className="text-right">
      {label}
    </Label>
    <Component
      id={id}
      value={value}
      onChange={onChange}
      type={type}
      className={className}
    />
  </div>
);

// AssignmentDialog component to create or edit assignments
const AssignmentDialog = ({
  updateAssignments = null,
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
  const { accessToken } = useAccessToken();
  const [tasks, setTasks] = useState(_tasks);
  const [formData, setFormData] = useState({
    points: _points,
    name: _name,
    promptInstructions: _promptInstructions,
    purpose: _purpose,
    instructions: _instructions,
    submission: _submission,
    grading: _grading,
    date: _date,
    time: _time,
  });
  const [open, setOpen] = useState(_open);

  // Handlers for form data and task changes
  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));
  const handleTaskChange = (index, field, value) =>
    setTasks(
      tasks.map((task, i) => (i === index ? { ...task, [field]: value } : task))
    );

  const handleAddTask = () =>
    setTasks([
      ...tasks,
      { title: "", description: "", points: null, dueDate: "", dueTime: "" },
    ]);
  const handleRemoveTask = (index) =>
    setTasks(tasks.filter((_, i) => i !== index));

  // Combine date and time into a single Date object
  const combineDateAndTime = (date, time) =>
    date && time ? new Date(`${format(date, "yyyy-MM-dd")}T${time}`) : null;

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedTasks = tasks.map((task) => ({
      ...task,
      dueDate: combineDateAndTime(task.dueDate, task.dueTime),
    }));
    const formDataToSend = {
      ...formData,
      dueDate: combineDateAndTime(formData.date, formData.time),
      tasks: updatedTasks,
    };

    try {
      let data;

      // Validate required fields
      if (assignmentId) {
        // If assignmentId exists, update the assignment
        data = await updateAssignment(
          courseId,
          assignmentId,
          accessToken,
          formDataToSend
        );
      } else {
        // If assignmentId does not exist, create a new assignment
        data = await createAssignment(courseId, accessToken, formDataToSend);
      }

      setOpen(false); // Close the dialog after submission
      if (updateAssignments) updateAssignments(data); // Update assignments in parent component
    } catch (error) {
      console.error("Error creating assignment and tasks:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children}
      <DialogContent className="sm:max-w-[925px] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>
            {assignmentId ? "Edit Assignment" : "Add Assignment"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <FormField
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            label="Assignment Name"
          />
          <FormField
            id="purpose"
            value={formData.purpose}
            onChange={(e) => handleChange("purpose", e.target.value)}
            label="Purpose"
            component={Textarea}
          />
          <FormField
            id="instructions"
            value={formData.instructions}
            onChange={(e) => handleChange("instructions", e.target.value)}
            label="Instructions"
            component={Textarea}
          />
          <FormField
            id="submission"
            value={formData.submission}
            onChange={(e) => handleChange("submission", e.target.value)}
            label="Submission Details"
            component={Textarea}
          />
          <FormField
            id="grading"
            value={formData.grading}
            onChange={(e) => handleChange("grading", e.target.value)}
            label="Grading Criteria"
            component={Textarea}
          />
          <FormField
            id="promptInstructions"
            value={formData.promptInstructions}
            onChange={(e) => handleChange("promptInstructions", e.target.value)}
            label="Chatbot Prompt Instructions"
            component={Textarea}
          />

          <div className="col-span-3">
            <Button variant="secondary" onClick={handleAddTask}>
              + Add Task
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {tasks.map((task, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center">
                  <CardTitle>Task</CardTitle>
                  <Button
                    variant="secondary"
                    className="ml-auto h-[30px] w-[30px]"
                    size="icon"
                    onClick={() => handleRemoveTask(index)}
                  >
                    <X />
                  </Button>
                </CardHeader>
                <CardContent>
                  <FormField
                    id={`task-title-${index}`}
                    value={task.title}
                    onChange={(e) =>
                      handleTaskChange(index, "title", e.target.value)
                    }
                    label="Task Name"
                  />
                  <FormField
                    id={`task-description-${index}`}
                    value={task.description}
                    onChange={(e) =>
                      handleTaskChange(index, "description", e.target.value)
                    }
                    label="Task Description"
                    component={Textarea}
                  />
                </CardContent>
              </Card>
            ))}
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
