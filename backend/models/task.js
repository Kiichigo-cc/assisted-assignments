import { DataTypes } from "sequelize";

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
  });
};
