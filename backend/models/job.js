module.exports = (sequelize, DataTypes) => {

  return sequelize.define('Job', {
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Companies',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    requirements: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    jobType: {
      type: DataTypes.ENUM('full-time', 'part-time', 'contract', 'internship'),
      allowNull: false
    },
    experienceLevel: {
      type: DataTypes.ENUM('entry', 'mid-level', 'senior', 'lead'),
      allowNull: false
    },
    salary: {
      type: DataTypes.JSON,
      allowNull: true,
      // Store as: { min: 50000, max: 80000, currency: 'USD' }
    },
    status: {
      type: DataTypes.ENUM('active','closed'),
      defaultValue: 'active'
    },
   
  }, {
    timestamps: true,
    indexes: [
      {
        fields: ['companyId']
      },
      {
        fields: ['status']
      },
      {
        fields: ['jobType']
      }
    ]
  });
}; 