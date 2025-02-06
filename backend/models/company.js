module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Company', {
      employeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'EmployerProfiles',
          key: 'userId',
        },
      },
      companyName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      companyDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      companyWebsite: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
      companyLogo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subscriptionPlan: {
        type: DataTypes.ENUM('free', 'basic', 'premium', 'enterprise'),
        allowNull: false,
        defaultValue: 'free',
      },
      subscriptionStatus: {
        type: DataTypes.ENUM('active', 'expired', 'cancelled'),
        allowNull: false,
        defaultValue: 'active',
      },
      industry: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      companySize: {
        type: DataTypes.ENUM('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'),
        allowNull: false,
      },
      contactEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      contactPhone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      postalCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      verifiedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      verifiedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM('pending', 'active', 'suspended'),
        allowNull: false,
        defaultValue: 'pending'
      },
      socialLinks: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {}
      },
      companyCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        defaultValue: () => Math.random().toString(36).substring(2, 10).toUpperCase()
      }
    }, {
      timestamps: true,
      indexes: [
        {
          fields: ['companyName'],
          unique: true
        },
        {
          fields: ['companyCode'],
          unique: true
        },
        {
          fields: ['employeeId']
        },
        {
          fields: ['industry']
        },
        {
          fields: ['city', 'state', 'country']
        }
      ]
    });
  };