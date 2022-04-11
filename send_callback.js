#!/usr/bin/env node
'use strict';

const amqp = require('amqplib/callback_api');
const settings = require('./util/settings');
const log = require('./util/log');
const args = require('./util/args');

function send(message = 'Hello from Callback') {
  function handleConnection(error, connection) {
    if (error) {
      throw error;
    }
    connection.createChannel(handleChannel);
    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  }

  function handleChannel(error, channel) {
    if (error) {
      throw error;
    }

    channel.assertQueue(settings.amqp.queue, { durable: false });
    if (channel.sendToQueue(settings.amqp.queue, Buffer.from(message))) {
      log.info(`Sent '${message}' to ${settings.amqp.queueInfo}`);
    } else {
      log.warn(`Could not sent '${message}' to ${settings.amqp.queueInfo}`);
    }
  }
  
  amqp.connect(settings.amqp.uri, handleConnection);
}

send(args);
