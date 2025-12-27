import { Apperror } from "../utlis/Apperror.js";

// middleware/branchAccess.js
export const branchAccess = (req, res, next) => {
  if (req.user.role === "admin") return next();

  if (req.user.role === "manager") {
    const branchId = req.body.branch_id || req.params.branch_id;

    if (!branchId) {
      return Apperror(next, "branch id is required", 400);
    }

    if (Number(branchId) !== Number(req.user.branch_id)) {
      return Apperror(next, "You can access only your own branch", 403);
    }
  }

  next();
};
