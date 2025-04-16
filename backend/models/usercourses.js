export default (sequelize, DataTypes) => {
  const UserCourses = sequelize.define(
    "UserCourses",
    {
      role: {
        type: DataTypes.STRING,
        defaultValue: "student",
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["UserUserId", "CourseId"],
        },
      ],
    }
  );

  return UserCourses;
};
