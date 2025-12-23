import { Apperror } from "../utlis/Apperror.js";


export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // islogin पछि मात्र चल्नुपर्छ
    if (!req.user || !req.user.role) {
      return Apperror(next, "Unauthorized", 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return Apperror(
        next,
        "You do not have permission to perform this action",
        403
      );
    }

    next();
  };
};
