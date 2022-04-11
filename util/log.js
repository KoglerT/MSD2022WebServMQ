'use strict';

function lpad(number, digits = 2, filler = '0') {
  return number.toString().padStart(digits, filler);
}

function timestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = lpad(now.getMonth() + 1);
  const day = lpad(now.getDate());
  const hour = lpad(now.getHours());
  const minutes = lpad(now.getMinutes());
  const seconds = lpad(now.getSeconds());
  const millis = lpad(now.getMilliseconds(), 3);

  return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}.${millis}`;
}

function info(message, symbol = '✓') {
  console.log(` [${symbol}] ${timestamp()} ${message}`);
}

function warn(message, symbol = '✗') {
  console.warn(` [${symbol}] ${timestamp()} ${message}`);
}

module.exports = {
  info,
  warn,
};
