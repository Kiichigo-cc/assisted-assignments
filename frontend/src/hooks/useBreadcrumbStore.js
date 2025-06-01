// useBreadcrumbStore.js
import { create } from "zustand";

// Zustand store for managing breadcrumb state in a React application
const useBreadcrumbStore = create((set) => ({
  courseId: null,
  courseTitle: "",
  assignmentId: null,
  assignmentTitle: "",
  taskId: null,
  taskTitle: "",

  // Set breadcrumb parameters
  setBreadcrumbs: (
    courseId,
    courseTitle,
    assignmentId,
    assignmentTitle,
    taskId,
    taskTitle
  ) => {
    set({
      courseId,
      courseTitle,
      assignmentId,
      assignmentTitle,
      taskId,
      taskTitle,
    });
  },

  // Reset all breadcrumb parameters
  resetBreadcrumbs: () => {
    set({
      courseId: null,
      courseTitle: "",
      assignmentId: null,
      assignmentTitle: "",
      taskId: null,
      taskTitle: "",
    });
  },
}));

export default useBreadcrumbStore;
