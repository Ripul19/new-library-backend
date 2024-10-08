const Sequelize = require('sequelize');
const sequelize = require('../utils/database.js');

const BorrowHistory = sequelize.define('BorrowHistory', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    borrowDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    returnDate: {
        type: Sequelize.DATE,
        allowNull: true
    },
    userId: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: false,
    },
    bookId: {
        type: Sequelize.UUID,
        allowNull: false,
        unique:false,
    },
    status: {
        type: Sequelize.ENUM('BORROWED', 'RETURNED'),
        allowNull: false,
        defaultValue: 'BORROWED'
    }
}, {
    timestamps: true
});

module.exports = BorrowHistory;