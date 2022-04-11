#!/usr/bin/env node
'use strict';

const amqp = require('amqplib');
const settings = require('./util/settings');
const log = require('./util/log');

/**
 * Callback function for message, received from
 * binded queue(s)
 * @param {string} message
 */
function onMessage(message) {
  if (message.content) {
    const msg = message.content.toString();
    const timeout = (msg.split('.').length - 1) * 1000;
    log.info(`Received '${msg}'`);
    setTimeout(() => {
      log.info('Done');
      // channel.ack(msg);
    }, timeout);
  }
}

(async function listen() {
  try {
    const connection = await amqp.connect(settings.amqp.uri);
    const channel = await connection.createChannel()
    const queue = "task_queue"
    const q = await channel.assertQueue(queue, {
      durable: true
    });
    /*
    // code for later exchange tutorial
    await channel.assertExchange(settings.amqp.exchange, 'fanout', {
      durable: false,
    });
    const q = await channel.assertQueue('', { exclusive: true });
    await channel.bindQueue(q.queue, settings.amqp.exchange, '');
    */
    // channel.prefetch(1);

    log.info(
      `Waiting for messages from [${settings.amqp.exchange || ''}/${q.queue}]. To exit press CTRL+C`,
      '*'
    );

    channel.consume(q.queue, onMessage, { noAck: false });
  } catch (err) {
    console.error(err);
  }
})();
