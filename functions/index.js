const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

exports.deleteExpiredRooms = functions.https.onRequest(async (req, res) => {
    var db = admin.database();

    // Delete all rooms 1 day passed since it was created
    return db.ref('/').once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            if (childSnapshot.hasChild('createdAt')) {
                var createdAt = childSnapshot.child('createdAt').val();
                var currentDate = Date.now();
                var difference = currentDate - createdAt;

                if (difference > 86400000) {
                    childSnapshot.ref.remove();
                }
            } else {
                childSnapshot.ref.remove();
            }
        });
    });
});
