const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

// Extend Period
const extendPeriod = (amount, interval = "h", currentTime = new Date()) =>
  moment(currentTime).add(Number(amount), interval).toDate();

const generateId = () => {
  let id = uuidv4();
  return id.replace(/-/g, "");
};

module.exports = { extendPeriod, generateId };
