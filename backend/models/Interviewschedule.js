module.exports = (sequelize, DataTypes) => {
    const Interview = sequelize.define('Interview', {
        jobApplicationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'JobApplications',
                key: 'id'
            }
        },
        scheduledDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        startTime: {
            type: DataTypes.TIME,
            allowNull: false
        },
        endTime: {
            type: DataTypes.TIME,
            allowNull: false
        },
        meetingUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('scheduled', 'completed', 'cancelled', 'pending'),
            defaultValue: 'scheduled'
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    });

    return Interview;
};