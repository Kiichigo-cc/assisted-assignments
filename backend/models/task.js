export default (sequelize, DataTypes) => {
  // Task table creation in database
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
    // Adding task as a foreign key into assignment
    Task.belongsTo(models.Assignment, {
      foreignKey: "assignmentId",
      as: "assignment",
    });
  };

  return Task;
};
