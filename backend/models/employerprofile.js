// employerprofile.js
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('EmployerProfile', {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        unique: true
      },
      companyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Companies',
          key: 'id'
        }
      },
      // Basic Professional Info
      designation: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      department: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      // Basic Contact Info
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      }
    }, {
      timestamps: true,
      indexes: [
        {
          fields: ['userId'],
          unique: true
        },
        {
          fields: ['companyId']
        }
      ]
    });
};