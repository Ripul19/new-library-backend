const { Book, User, BorrowHistory } = require('../models/modelIndex');

/**
 * @route POST /api/books/add
 * @desc Add a new book
 */
exports.addBook = async (req, res) => {
    try {
        const { title, author } = req.body;
        const newBook = await Book.create({ title, author });
        res.status(201).json({newBook, success: true});
    } 
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * @route PUT /api/books/update/:bookId
 * @desc Update the book details
 */
exports.updateBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        const { title, author } = req.body;

        const book = await Book.findByPk(bookId);
        if (!book) return res.status(404).json({ error: 'Book not found' });
        
        book.title = title;
        book.author = author;
        await book.save();
        return res.status(200).json({ book, success:true });
    } 
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

/**
 * @route DELETE /api/books/delete/:bookId
 * @desc Delete a book
 */
exports.deleteBook = async (req, res) => {
    try {
        const { bookId } = req.params;

        const book = await Book.findByPk(bookId);
        if (!book) return res.status(404).json({ error: 'Book not found' });
        
        await book.destroy();
        return res.status(200).json({ message: 'Book deleted successfully' });
    } 
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

/**
 * @route GET /api/books
 * @desc Get all books
 */
exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.findAll();
        return res.status(200).json(books);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

/**
 * @route GET /api/books/:bookId
 * @desc Get a book by ID
 */
exports.getBookById = async (req, res) => {
    try {
        const { bookId } = req.params;
        
        const book = await Book.findByPk(bookId);
        if (!book) return res.status(404).json({ error: 'Book not found' });
        
        return res.status(200).json(book);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

/**
 * @route POST /api/books/borrow/:bookId/user/:userId
 * @desc Borrow Book
 */
exports.borrowBook = async (req, res) => {
    try {
        const { bookId, userId } = req.params;
        const id = req.user.id;

        if(userId !== id) return res.status(400).json({message: 'Validation error'});

        const history = await BorrowHistory.findOne({
            where: { bookId: bookId, userId: userId, status: 'BORROWED' }  
        });
        if(history) {
            return res.status(400).json({message: 'Book is already borrowed by the user'});
        }

        const book = await Book.findByPk(bookId);
        if (!book || book.status === 'BORROWED') return res.status(404).json({ error: 'Book not available' });

        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        const bookHistory = await BorrowHistory.create({ bookId, userId, status: 'BORROWED' }); //validation error
        
        book.status= 'BORROWED';
        await book.save();

        return res.status(200).json(bookHistory);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

/**
 * @route PUT /api/books/return/:bookId/user/:userId
 * @desc  Return book
 */
exports.returnBook = async (req, res) => {
    try {
        const { bookId, userId } = req.params;
        const id = req.user.id;

        if(userId !== id) return res.status(400).json({message: 'Validation error'});

        const history = await BorrowHistory.findOne({
            where: { bookId: bookId, userId: userId, status: 'BORROWED' }  
        });
        if(!history) {
            return res.status(400).json({message: 'Book not borrowed by the user'});
        }

        const book = await Book.findByPk(bookId);
        if (!book || book.status === 'AVAILABLE') return res.status(404).json({ error: 'Book not borrowed' });

        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        history.returnDate = new Date();
        history.status = 'RETURNED';
        await history.save();
        book.status= 'AVAILABLE';
        await book.save();

        return res.status(200).json({ message: 'Book Returned Successfully', history });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};