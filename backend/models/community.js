// models/Community.js

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Community', {
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      text: {
        type: DataTypes.TEXT,  // Using TEXT for longer messages
        allowNull: false
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      timestamps: true,
      indexes: [
        {
          fields: ['userId']
        },
        {
          fields: ['timestamp']
        }
      ]
    });
  };