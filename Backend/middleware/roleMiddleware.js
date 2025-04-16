import  UserType  from "../../Shared/user.types.js";

// Middleware to check if the user has the required role
const roleMiddleware = (roles = []) => {
  // If roles is a string, convert to array
  if (typeof roles === "string") {
    roles = [roles];
  }

  return (req, res, next) => {
    // Check if user object exists (from authMiddleware)
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not authenticated" });
    }

    // If no specific roles required, allow all authenticated users
    if (roles.length === 0) {
      return next();
    }

    // Check if user role is in the authorized roles list
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message:
          "Forbidden: You do not have permission to access this resource",
      });
    }

    // User has required role
    next();
  };
};

// Helper functions for common role checks
export const isEmployee = roleMiddleware([UserType.EMPLOYEE]);
export const isCustomer = roleMiddleware([UserType.CUSTOMER]);
export const isAnyRole = roleMiddleware([]); // Allow any authenticated user

export default roleMiddleware;
