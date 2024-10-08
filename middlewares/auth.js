const jwt = require('jsonwebtoken');

const authorization = (req, res, next) => {
    const [header, token] = req.headers['authorization'].split(' ');

    if(header !== 'Bearer'){
        return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = decoded;
        next();
    });
}

const authorizeLibrarian = (req, res, next) => {
    const [header, token] = req.headers['authorization'].split(' ');
    if(header !== 'Bearer'){
        return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        if (decoded.role !== 'LIBRARIAN') {
            return res.status(403).json({ message: 'Forbidden: Access is denied' });
        }

        req.user = decoded;
        next();
    });
}



module.exports = {
    authorization,
    authorizeLibrarian
};