const Sequelize = require('sequelize');
const sequelize = require('../utils/database.js');

const Book = sequelize.define('Book', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    author: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM('AVAILABLE', 'BORROWED'),
        defaultValue: 'AVAILABLE',
        allowNull: false,
    },
},
{
    timestamps: true,
});

module.exports = Book;
