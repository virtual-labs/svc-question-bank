// validationMap.js

const { validateV1, validateV2 } = require('./validators');

const validationMap = {
  1.0: validateV1,
  2.0: validateV2
};

module.exports = validationMap;
