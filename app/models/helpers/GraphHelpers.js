const helpers = {};

helpers.generateId = () =>`x${Math.random() * 1000000000000}`;

module.exports = helpers;
