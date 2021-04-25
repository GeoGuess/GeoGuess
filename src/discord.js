'use strict';

const RPC = require('discord-rpc');

const startTimestamp = new Date();
function makeClient(clientId = '') {
    const client = new RPC.Client({ transport: 'websocket' });

    RPC.register(clientId);

    client.on('ready', () => {
        debugger;
    console.log('Logged in as', client.application.name);
    console.log('Authed for user', client.user.username);

    client.setActivity({
            details: `booped times`,
    state: 'in slither party',
    startTimestamp,
    largeImageKey: 'snek_large',
    largeImageText: 'tea is delicious',
    smallImageKey: 'snek_small',
    smallImageText: 'i am my own pillows',
    instance: false,
    });

    });


    // Log in to RPC with client id
    client.login({clientId }).catch(console.error);
    
    console.log('Logged in as', client);

  return client;
}

const client = makeClient();
export default client;