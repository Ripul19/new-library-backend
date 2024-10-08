const Sequelize = require("sequelize");
const pg = require('pg');
const fs = require('fs');

// const logQuery = (query, options) => {
//     const logFile = 'database.log';
//     const logEntry = `${new Date().toISOString()} - ${query}\n`;
//     fs.appendFileSync(logFile, logEntry);
// };

const sequelize = new Sequelize(process.env.POSTGRES_DATABASE, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
    dialectModule: pg,
    // logging: logQuery,
    dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false 
        }
      }
});

sequelize.authenticate()
.then(() => {
  console.log('Connection has been established successfully.');
})
.catch(err => {
  console.error('Unable to connect to the database:', err);
});

module.exports = sequelize;