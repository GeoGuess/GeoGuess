const functions = require('firebase-functions')

const admin = require('firebase-admin')
admin.initializeApp()

exports.deleteExpiredRooms = functions.pubsub.schedule('every wednesday 00:00').onRun((context) => {
  var db = admin.database()
  var promises = []

  // Delete all rooms 1 day passed since it was created
  db.ref('/').once('value', (snapshot) => {
  	snapshot.forEach((childSnapshot) => {
      if (childSnapshot.hasChild('createdAt')) {
        var createdAt = childSnapshot.child('createdAt').val()
        var currentDate = Date.now()
        var difference = currentDate - createdAt

        if (difference > 86400000) {
          var promise = childSnapshot.ref.remove()
          promises.push(promise)
        }
      } else {
        var promise = childSnapshot.ref.remove()
        promises.push(promise)
      }
  	})
    return Promise.all(promises)
  })
})
