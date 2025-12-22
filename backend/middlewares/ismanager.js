export const ismanager = async (req, res, next) => {
  const { role } = req.user;
  if (role !== "manager") {
    return Apperror(next, "Manager Only Access", 400);
  }
  next();
};
