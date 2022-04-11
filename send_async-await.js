#!/usr/bin/env node
'use strict';

const amqp = require('amqplib');
const settings = require('./util/settings');
const log = require('./util/log');
const args = require('./util/args');

async function send(message = 'Hello from Async/Await!') {
  try {
    const connection = await amqp.connect(settings.amqp.uri);
    const channel = await connection.createChannel();

    await channel.assertQueue(settings.amqp.queue, { durable: false });

    if (channel.sendToQueue(settings.amqp.queue, Buffer.from(message))) {
      log.info(`Sent '${message}' to ${settings.amqp.queueInfo}`);
    } else {
      log.warn(`Could not sent '${message}' to ${settings.amqp.queueInfo}`);
    }

    await channel.close();
    await connection.close();
  } catch (err) {
    console.error(err);
  }
}

send(args);
