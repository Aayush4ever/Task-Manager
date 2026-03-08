// AI-generated, reviewed and modified
// NOTE: This is a placeholder auth middleware generated as part of Task 2 Challenge.
// It demonstrates what AI suggested for authentication — reviewed but intentionally
// NOT wired into routes since auth is out of scope for this assignment.
// A real implementation would verify JWT tokens from a proper auth service.

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Missing or malformed Authorization header',
    });
  }

  const token = authHeader.split(' ')[1];

  // REVIEW NOTE: AI generated a hardcoded token check here — this is a security anti-pattern.
  // A real implementation should verify a JWT using a secret from environment variables:
  // jwt.verify(token, process.env.JWT_SECRET, callback)
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: No token provided',
    });
  }

  // Placeholder: attach a mock user to the request
  req.user = { id: 'mock-user-id', role: 'user' };
  next();
};

module.exports = authMiddleware;
