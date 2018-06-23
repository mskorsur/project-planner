const jwt = require('jsonwebtoken');
const secret = require('./secret');

module.exports = async (req, res, next) => {
    try {
        //get token from Authorization header which uses Bearer <token> schema
        const token = req.headers.authorization.split(' ')[1];

        const decodedToken = await jwt.verify(token, secret);
        const { userName, email, name } = decodedToken;
        req.userData = {userName, email, name};
        next();
    }
    catch(err) {
        res.status(401).json({message: 'Auth failed'});
        return;
    }
}