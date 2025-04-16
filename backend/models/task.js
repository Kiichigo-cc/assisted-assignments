export default (sequelize, DataTypes) => {
  const Task = sequelize.define("Task", {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    points: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    dueDate: DataTypes.DATE,
  });

  Task.associate = (models) => {
    Task.belongsTo(models.Assignment, {
      foreignKey: "assignmentId",
      as: "assignment",
    });
  };

  return Task;
};
