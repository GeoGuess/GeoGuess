'use strict';

const RPC = require('discord-rpc');

const startTimestamp = new Date();
function makeClient(clientId = '835891285940240406') {
    const client = new RPC.Client({ transport: 'websocket' });

    RPC.register(clientId);

    client.on('ready', () => {
        // eslint-disable-next-line no-debugger
        debugger;
        // eslint-disable-next-line no-console
    console.log('Logged in as', client.application.name);
    // eslint-disable-next-line no-console
    console.log('Authed for user', client.user.username);
      setInterval(()=>{
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
      },1);


    });
  

    // Log in to RPC with client id
        // eslint-disable-next-line no-console
    client.login({clientId, scopes: ['rpc', 'rpc.api', 'messages.read'] }).catch(console.error);
  
        // eslint-disable-next-line no-console
    console.log( client);
    // eslint-disable-next-line no-console
console.log( clientId);

  return client;
}

const client = makeClient();
export default client;