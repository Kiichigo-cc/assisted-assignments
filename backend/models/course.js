export default (sequelize, DataTypes) => {
  const Course = sequelize.define("Course", {
    id: {
      type: DataTypes.UUID,
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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  Course.associate = (models) => {
    Course.hasMany(models.Assignment, {
      foreignKey: "courseId",
      as: "assignments",
    });

    Course.belongsToMany(models.User, {
      through: models.UserCourses,
      as: "users",
      foreignKey: "CourseId",
      otherKey: "UserUserId",
    });
  };

  return Course;
};
