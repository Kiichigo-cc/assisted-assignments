export default (sequelize, DataTypes) => {
  // Database table creation for chatlogs
  const ChatLog = sequelize.define("ChatLog", {
    chatId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    userId: DataTypes.STRING,
    userName: DataTypes.STRING,
    message: DataTypes.TEXT,
    sender: {
      type: DataTypes.ENUM("user", "system"),
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    metadata: DataTypes.JSONB,
  });

  ChatLog.associate = (models) => {
    // Creating foreign key entry in assignment table
    ChatLog.belongsTo(models.Assignment, {
      foreignKey: "assignmentId",
      as: "assignment",
    });
  };

  return ChatLog;
};
