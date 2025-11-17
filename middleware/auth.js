const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

module.exports = async function(req, res, next){
  const token = req.header('Authorization')?.replace('Bearer ', '') || req.query.token;
  if(!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try{
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  }catch(err){
    res.status(401).json({ message: 'Token is not valid' });
  }
};
