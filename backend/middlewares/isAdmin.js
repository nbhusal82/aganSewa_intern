export const isadmin = (req, res, next) => {
  const { role } = req.user;
  if (role !== "admin") {
    return Apperror(next, "You are not authorized to access this route", 400);
  }
  next();
};
