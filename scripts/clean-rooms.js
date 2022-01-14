#!/usr/bin/env node

const admin = require('firebase-admin');
const yargs = require('yargs');

const argv = yargs
  .scriptName("clean-rooms")
  .usage('$0 -f <file-path> -c <database>')
  .option('file-path', {
    alias: 'f',
    describe: 'Path to the file to be uploaded',
    type: 'string',
    default: './keys.json'
  })
  .option('databaseUrl', {
    alias: 'd',
    description: 'realtime database url',
    type: 'string',
    default: 'https://clean-rooms.firebaseio.com/',
  })
  .help()
  .alias('help', 'h').argv;


const serviceAccount = require(argv.filePath);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: argv.databaseUrl,
});

const db = admin.database();

// Delete all rooms 1 day passed since it was created
db.ref('/')
    .once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            if (childSnapshot.hasChild('createdAt')) {
                const createdAt = childSnapshot.child('createdAt').val();
                const currentDate = Date.now();
                const difference = currentDate - createdAt;

                if (difference > 86400000) {
                    console.log('delete : ' + childSnapshot.key);
                    childSnapshot.ref.remove();
                }
            } else {
                childSnapshot.ref.remove();
            }
        });
    })
    .then(() => {
        process.exit(0);
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
