const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.response && err.response.data) {
    return res.status(err.response.status || 500).json({
      error: err.response.data.error || 'An error occurred with the AI service'
    });
  }

  res.status(500).json({
    error: 'Internal server error'
  });
};

module.exports = errorHandler; 