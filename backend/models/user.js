export default (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isIn: [["instructor", "student"]],
      },
    },
  });

  User.associate = (models) => {
    User.belongsToMany(models.Course, {
      through: models.UserCourses,
      as: "courses",
      foreignKey: "UserUserId",
      otherKey: "CourseId",
    });
  };

  return User;
};
