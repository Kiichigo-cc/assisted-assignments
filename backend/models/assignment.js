export default (sequelize, DataTypes) => {
  const Assignment = sequelize.define("Assignment", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    promptInstructions: {
      type: DataTypes.TEXT,
      allowNull: true,
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

  Assignment.associate = (models) => {
    Assignment.belongsTo(models.Course, {
      foreignKey: "courseId",
      as: "course",
    });
    Assignment.hasMany(models.Task, {
      foreignKey: "assignmentId",
      as: "tasks",
    });
    Assignment.hasMany(models.ChatLog, {
      foreignKey: "assignmentId",
      as: "chatLogs",
    });
  };

  return Assignment;
};
