import { DataTypes } from "sequelize";

export const Course = (sequelize) => {
  return sequelize.define("Course", {
    id: {
      type: DataTypes.UUID, // Using UUID for unique ID
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    courseName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    courseNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    term: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    courseId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Ensures courseId is unique
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });
};

export const Assignment = (sequelize) => {
  return sequelize.define("Assignment", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    purpose: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    submission: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    grading: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });
};

export const Task = (sequelize) => {
  return sequelize.define("Task", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    // This field will store the combined due date and time for the task
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    assignmentId: {
      type: DataTypes.STRING, // Foreign key type matches the primary key type of the Assignment model
      allowNull: false,
      references: {
        model: "Assignments", // Name of the Assignment model in the database
        key: "id", // The primary key in the Assignment model
      },
    },
  });
};

export const User = (sequelize) => {
  return sequelize.define("User", {
    userId: {
      type: DataTypes.STRING, // userId as a string
      allowNull: false,
      unique: true, // Ensure userId is unique
      primaryKey: true, // Mark as the primary key
    },
    profilePicture: {
      type: DataTypes.STRING, // URL or file path for profile picture
      allowNull: true, // Profile picture is optional
    },
    name: {
      type: DataTypes.STRING, // User's name
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING, // Role: either "instructor" or "student"
      allowNull: true,
      validate: {
        isIn: [["instructor", "student"]], // Ensure the role is either instructor or student
      },
    },
  });
};
