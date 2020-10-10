module.exports = app => {
  require('./register/api')(app);
  require('./account/api')(app);
};
