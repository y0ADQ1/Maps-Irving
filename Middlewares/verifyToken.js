const jwt = require('jsonwebtoken');
const blacklist = require('./blacklist');

module.exports = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
  }

  if (blacklist.includes(token)) {
    return res.status(401).json({ message: 'Token inválido. Por favor, inicia sesión nuevamente.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
};
