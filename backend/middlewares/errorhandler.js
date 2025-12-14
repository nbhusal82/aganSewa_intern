// middlewares/sendErrorMiddleware.js
export const sendError = (err, req, res, next) => {
  const message = err.message || "Server error";
  const statusCode = err.statusCode || 500;
  const status = err.status || "Failed";

  res.status(statusCode).json({ status, message });
};
