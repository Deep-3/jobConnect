const {Sequelize}=require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
      host: process.env.DB_HOST,
      dialect: process.env.DB_DIALECT,

      define: {
        charset: 'utf8mb4',    // Support full UTF-8 characters (including emojis)
        collate: 'utf8mb4_unicode_ci',  // Case-insensitive sorting
        
        // MySQL specific options
        dialectOptions: {
            charset: 'utf8mb4',    // Character encoding for connections
            collate: 'utf8mb4_unicode_ci'  // Sorting rules
        }
    }
} );
try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

sequelize.sync({alter:true})
  .then(()=>console.log('database sync sucessfully'))
  .catch((err)=>console.log('database sync failed',err));
  
  
  module.exports=sequelize;
