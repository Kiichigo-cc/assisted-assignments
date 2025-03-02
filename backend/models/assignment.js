import { DataTypes } from "sequelize";

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
