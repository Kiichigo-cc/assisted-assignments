import { DataTypes } from "sequelize";

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
