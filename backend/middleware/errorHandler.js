const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  let message = err.message || 'Server Error';
  if (err.code === 11000) message = 'Username already exists';
  if (err.name === 'ValidationError') message = Object.values(err.errors).map(e => e.message).join(', ');
  res.status(err.statusCode || 500).json({ success: false, message });
};

module.exports = errorHandler;
