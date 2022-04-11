'use strict';

// init dotenv, will read `.env` file in your project root
require('dotenv').config();

const NODE_ENV = process.env.NODE_ENV || 'development';
const AMQP_HOST = process.env.AMQP_HOST || 'localhost';
const AMQP_PROTOCOL = process.env.AMQP_PROTOCOL || 'amqp';
const AMQP_PORT =
  process.env.AMQP_PORT || AMQP_PROTOCOL === 'amqp' ? '5672' : '5671';
const AMQP_VHOST = process.env.AMQP_VHOST || '/';
const AMQP_USER = process.env.AMQP_USER || 'guest';
const AMQP_PASS = process.env.AMQP_PASS || 'guest';
const AMQP_QUEUE = process.env.AMQP_QUEUE || 'msd';
const AMQP_EXCHANGE = process.env.AMQP_EXCHANGE || undefined;

module.exports = {
  NODE_ENV,
  amqp: {
    host: AMQP_HOST,
    protocol: AMQP_PROTOCOL,
    port: AMQP_PORT,
    vhost: AMQP_VHOST,
    credentials: {
      user: AMQP_USER,
      password: AMQP_PASS,
    },
    queue: AMQP_QUEUE,
    exchange: AMQP_EXCHANGE,
    get uri() {
      // default: amqp://guest:guest@localhost:5672/
      return `${this.protocol}://${this.credentials.user}:${this.credentials.password}@${this.host}:${this.port}${this.vhost}`;
    },
    get queueInfo() {
      return this.exchange ? `${this.exchange}/${this.queue}` : this.queue;
    },
  },
};
