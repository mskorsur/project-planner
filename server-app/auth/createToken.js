const jwt = require('jsonwebtoken');
const secret = require('./secret');

module.exports = async (payload) => {
    return await jwt.sign(
        payload, 
        secret,
        {
            expiresIn: '1h',
            issuer: 'project-planner-api'  
        }
    );
}