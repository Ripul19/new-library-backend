const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { authorization, authorizeLibrarian } = require('../middlewares/auth');

router.post('/add', authorizeLibrarian, bookController.addBook);
router.put('/update/:bookId', authorizeLibrarian, bookController.updateBook);
router.delete('/delete/:bookId', authorizeLibrarian, bookController.deleteBook);

router.get('/', authorization, bookController.getAllBooks);
router.get('/:bookId', authorization, bookController.getBookById);
router.post('/borrow/:bookId/user/:userId', authorization, bookController.borrowBook);
router.put('/return/:bookId/user/:userId', authorization, bookController.returnBook);

module.exports= router;