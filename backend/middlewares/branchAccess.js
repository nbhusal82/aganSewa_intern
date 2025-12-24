import { Apperror } from "../utlis/Apperror.js";

// middleware/branchAccess.js
export const BranchAccess = (req, res, next) => {
  // Admin can access all branches
  if (req.user.role === "admin") return next();

  // Manager can access only their own branch
  if (req.user.role === "manager") {
    // Check branch_id from body or params
    const branchId = req.body.branch_id || req.params.branch_id;

    if (!branchId) {
      return Apperror(next, "branch id is required", 400);
    }

    if (Number(branchId) !== Number(req.user.branch_id)) {
      return Apperror(next, "You can access only your own branch", 400);
    }
  }

  next();
};
