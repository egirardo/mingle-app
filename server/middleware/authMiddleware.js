import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attaches { id, type } to the request
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Role-based middleware factory — enforces user type
const requireAuth = (requiredType) => {
  return (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.type !== requiredType) {
        return res.status(403).json({ message: 'Insufficient permissions for this resource' });
      }

      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
};

export { authMiddleware as default, requireAuth };
