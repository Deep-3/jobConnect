
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true, // Allow null for social logins
        validate: {
          isPasswordProvided(value) {
            if (!value && this.authProvider === 'local') {
              throw new Error('Password is required for local authentication.');
            }
          },
        },
      },
      authProvider: {
        type: DataTypes.ENUM('local', 'google', 'linkedin'),
        allowNull: false,
        defaultValue: 'local',
      },
      role: {
        type: DataTypes.ENUM('jobseeker','employee','admin','hr'),
        allowNull: true,
      },
      otp: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      otpExpiry: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,  // Initially false
      },
    },
     {
      timestamps: true   
});
};
