export const isadmin = (req, res, next) => {
  const { role } = req.user;
  if (role !== "admin") {
    return Apperror(next, "Admin only Access ..", 400);
  }
  next();
};
