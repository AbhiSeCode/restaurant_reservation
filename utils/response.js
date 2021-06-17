const response = (success, message, data = {}) => {
  return {
    success,
    message,
    data,
  };
};

module.exports = response;
