#!/usr/bin/env node
'use strict';

const amqp = require('amqplib');
const settings = require('./util/settings');
const log = require('./util/log');
let channelglobal;
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
      channelglobal.ack(message);
    }, timeout);
  }
}

(async function listen() {
  try {
    const connection = await amqp.connect(settings.amqp.uri);
     channelglobal = await connection.createChannel()
    // const q = await channelglobal.assertQueue(settings.amqp.queue, {
    //   durable: true
    // });

     // code for later exchange tutorial
   await channelglobal.assertExchange(settings.amqp.exchange, 'fanout', {
      durable: false,
    });
    const q = await channelglobal.assertQueue('', { exclusive: true });
    await channelglobal.bindQueue(q.queue, settings.amqp.exchange, '');

    channelglobal.prefetch(1);

    log.info(
      `Waiting for messages from [${settings.amqp.exchange || ''}/${q.queue}]. To exit press CTRL+C`,
      '*'
    );

    channelglobal.consume(q.queue, onMessage, { noAck: false });
  } catch (err) {
    console.error(err);
  }
})();
