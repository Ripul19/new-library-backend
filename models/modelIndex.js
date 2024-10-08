const sequelize = require("../utils/database");
const User = require('./userModel');
const Book = require('./bookModel');
const BorrowHistory = require('./historyModel');

User.belongsToMany(Book, {
  through: BorrowHistory,
  foreignKey: 'userId',
  as: 'borrowedBooks'
});

Book.belongsToMany(User, {
  through: BorrowHistory,
  foreignKey: 'bookId',
  as: 'borrowers'
});

User.hasMany(BorrowHistory, { 
  foreignKey: 'userId', 
  sourceKey: 'id', 
  as: 'borrowHistory' 
});

BorrowHistory.belongsTo(User, { 
  foreignKey: 'userId', 
  targetKey: 'id', 
  as: 'user' 
});

Book.hasMany(BorrowHistory, { 
  foreignKey: 'bookId', 
  sourceKey: 'id', 
  as: 'borrowHistory' 
});

BorrowHistory.belongsTo(Book, { 
  foreignKey: 'bookId', 
  targetKey: 'id', 
  as: 'book' 
});




module.exports = {
  sequelize,
  User,
  Book,
  BorrowHistory
};
