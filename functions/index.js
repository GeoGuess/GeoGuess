const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

exports.deleteExpiredRooms = functions.https.onRequest(async (req, res) => {
    const db = admin.database();

    // Delete all rooms 1 day passed since it was created
    db.ref('/').once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            if (childSnapshot.hasChild('createdAt')) {
                const createdAt = childSnapshot.child('createdAt').val();
                const currentDate = Date.now();
                const difference = currentDate - createdAt;

                if (difference > 86400000) {
                    functions.logger.log("delete : "+ childSnapshot.key);
                    childSnapshot.ref.remove();
                }
            } else {
                childSnapshot.ref.remove();
            }
        });
    }).then(() => {
        res.status(200).send('Success');
    }).catch((error) => {
        res.status(500).send(error);
    });
});
