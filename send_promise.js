#!/usr/bin/env node
'use strict';

const amqp = require('amqplib');
const settings = require('./util/settings');
const log = require('./util/log');
const args = require('./util/args');

function send(message = 'Hello from Promise! I did the tutorial') {
  let connection;
  let channel;
  amqp
    .connect(settings.amqp.uri)
    .then((con) => {
      connection = con;
      return connection.createChannel();
    })
    .then((chan) => {
      channel = chan;
      // return channel.assertQueue(settings.amqp.queue, { durable: true });
      return channel.assertExchange(settings.amqp.exchange, 'fanout', { durable: false });
    })
    // .then(() => channel.sendToQueue(settings.amqp.queue, Buffer.from(message)), {persistent: true})
    .then(() => channel.publish(settings.amqp.exchange, '', Buffer.from(message)))
    .then((isSent) => {
      if (isSent) {
        log.info(`Sent '${message}' to ${settings.amqp.queueInfo}`);
      } else {
        log.warn(`Could not sent '${message}' to ${settings.amqp.queueInfo}`);
      }
      // we need a last async cycle, otherwise the message
      // will not received by the broker, because
      // the connection is closed before!
      // We can do this with `Promise.resolve`
      // or `channel.close()` (because channel.close() will
      // return a Promise)
      return channel.close();
      // return Promise.resolve(); // alternative to above `channel.close()`
    })
    .catch(console.error)
    .finally(() => {
      if (connection) {
        connection.close();
      }
    });
}

send(args);
