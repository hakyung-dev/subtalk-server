const CLIENT_URL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'PRODUCT';

module.exports = { CLIENT_URL };
