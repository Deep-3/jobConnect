
module.exports = (sequelize, DataTypes) => {
    const JobApplication = sequelize.define('JobApplication', {
        jobId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'Jobs',
              key: 'id'
            }
          },
          jobSeekerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'JobSeekerProfiles',
              key: 'id'
            }
          },
          // Data from JobSeekerProfile at time of application
          skills: {
            type: DataTypes.STRING,
            allowNull: true
          },
          education: {
            type: DataTypes.STRING,
            allowNull: true
          },
          experience: {
            type: DataTypes.STRING,
            allowNull: true
          },
          certifications: {
            type: DataTypes.STRING,
            allowNull: true
          },
          resumeUrl: {
            type: DataTypes.STRING,
            allowNull:false
          },
          status: {
            type: DataTypes.ENUM('Reviewed', 'Shortlisted', 'Rejected', 'Accepted'),
            defaultValue: 'Accepted'
          },
          appliedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
          }
    });
  
    return JobApplication;
  };