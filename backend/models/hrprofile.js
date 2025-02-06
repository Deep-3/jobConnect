module.exports = (sequelize, DataTypes) => {
    return sequelize.define('HRProfile', {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // Reference the User table
          key: 'id',      // Reference the primary key of the User table
        },
      },
      department: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      jobTitle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contactEmail: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },
      contactPhone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    }, {
      timestamps: true,
    });
  };