const { User, Book, BorrowHistory } = require('../models/modelIndex'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * @route POST /api/users/register
 * @desc Register a new user
 */
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        if(!username || !email || !password || !role) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await User.findOne({where :{ email }});
        if (existingUser) {
            if (existingUser.status === 'INACTIVE') {
                existingUser.username = username;
                existingUser.email = email;
                existingUser.password = hashedPassword; 
                existingUser.status = 'ACTIVE';
                await existingUser.save();
                return res.json({ message: 'User re-registered successfully', user: existingUser });
            } else {
                return res.status(400).json({ message: 'User already exists and is active' });
            }
        }

        const existingUserName = await User.findOne({where: { username }});
        if (existingUserName) {
            return res.status(400).json({ message: 'Username Taken, please select other username' });
        }

        const existingUserEmail = await User.findOne({where: { username }});
        if (existingUserEmail) {
            return res.status(400).json({ message: 'Email Taken, please select other username' });
        }

        const newUser = await User.create({ username, email, password: hashedPassword, role });

        return res.status(201).json({ message: 'User registered successfully' });
    } 
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @route POST /api/users/login
 * @desc Login a user
*/
exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if(!username || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        const user = await User.findOne({ 
            where: { username },
            attributes: { exclude: ['updatedAt', 'createdAt'] },
        });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        if (user.status === 'INACTIVE') {
            return res.status(403).json({ message: 'Account is deleted.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const userData = user.get({ plain: true });
        delete userData.password;

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '5h' });
        return res.status(200).json({ message: 'Login Successful', userData, token });
    } 
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @router Get /api/users/me
 * @desc Get user profile
 */
exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password', 'updatedAt'] },
            include: [{
                model: BorrowHistory,
                as: 'borrowHistory',
                attributes: ['id', 'bookId', 'borrowDate', 'returnDate', 'status'],
                include: [{
                    model: Book,
                    as: 'book',
                    attributes: ['id', 'title', 'author']
                }]
            }]
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ user });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @route GET /api/users/activeMembers
 * @desc Get a list of all users
 */
exports.getAllActiveMembers = async (req, res) => {
    try {
        const members = await User.findAll({
            where: { role: 'MEMBER', status: 'ACTIVE' },
            attributes: { exclude: ['password', 'updatedAt'] }
        });
        return res.status(200).json({ members });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @route GET /api/users/deletedMembers
 * @desc Get a list of all deleted users
 */
exports.getAllDeletedMembers = async (req, res) => {
    try {
        const members = await User.findAll({
            where: { role: 'MEMBER', status: 'INACTIVE' },
            attributes: { exclude: ['password', 'updatedAt'] }
        });
        return res.status(200).json({ members });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @route GET /api/users/member/:userId
 * @desc Get details of a specific user
 */
exports.getMemberById = async (req, res) => {
    try {
        const { userId } = req.params;
        // const user = await User.findByPk(userId, {
        //     where : { role: 'MEMBER' },
        //     attributes: { exclude: ['password', 'updatedAt'] }
        // });
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password', 'updatedAt'] },
            include: [{
                model: BorrowHistory,
                as: 'borrowHistory',
                attributes: ['id', 'bookId', 'borrowDate', 'returnDate', 'status'],
                include: [{
                    model: Book,
                    as: 'book',
                    attributes: ['id', 'title', 'author']
                }]
            }]
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ user });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @route PUT /api/users/update/:userId
 * @desc Update a user's details
 */
exports.updateMember = async (req, res) => {
    try {
        const { userId } = req.params;
        const { username, email } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (username) {
            const existUsername = await User.findOne({ where: { username }});
            if(existUsername) return res.status(400).json({message: "Username already taken"});

            user.username = username;
        }
        if (email) {
            const existEmail = await User.findOne({ where: { email }});
            if(existEmail) return res.status(400).json({message: "Email already taken"});

            user.email = email;
        }

        await user.save();
        const userData = user.get({ plain: true });
        delete userData.password;
        return res.status(200).json({ message: 'User updated successfully', userData });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @route DELETE /api/users/:userId
 * @desc Delete a user
 */
exports.deleteMember = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.status = 'INACTIVE';
        await user.save();

        return res.status(200).json({ message: 'User deleted successfully' });
    }
    catch(error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @route PUT /update/self
 * @desc Update a user's details
 */
exports.updateSelf = async (req, res) => {
    try {
        const userId = req.user.id;
        const { username, email, password } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (username) {
            const existUsername = await User.findOne({ where: { username }});
            if(existUsername) return res.status(400).json({message: "Username already taken"});

            user.username = username;
        }
        if (email) {
            const existEmail = await User.findOne({ where: { email }});
            if(existEmail) return res.status(400).json({message: "Email already taken"});

            user.email = email;
        }

        if(password){
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        await user.save();
        const userData = user.get({ plain: true });
        delete userData.password;
        return res.status(200).json({ message: 'User updated successfully', userData });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @route DELETE /delete/self
 * @desc Delete a user
 */
exports.deleteSelf = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.status = 'INACTIVE';
        await user.save();

        return res.status(200).json({ success: true, message: 'User deleted successfully' });
    }
    catch(error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};