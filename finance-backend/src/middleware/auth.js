// src/middleware/auth.js
const roles = {
    ADMIN: ['create_user', 'manage_user', 'create_record', 'update_record', 'delete_record', 'view_all'],
    ANALYST: ['view_all', 'view_insights'],
    VIEWER: ['view_all']
  };
  
  const authorize = (requiredPermission) => {
    return (req, res, next) => {
      // In a real app, you'd get the user from a JWT. 
      // Here we pass it via a header 'x-user-role' for demonstration.
      const userRole = req.headers['x-user-role']; 
      
      if (!userRole || !roles[userRole]) {
        return res.status(403).json({ error: "Access Denied: No role provided" });
      }
  
      if (roles[userRole].includes(requiredPermission)) {
        next();
      } else {
        res.status(403).json({ error: "Insufficient permissions" });
      }
    };
  };
  
  module.exports = { authorize };