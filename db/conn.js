const { MongoClient } = require('mongodb');
const connectionString = process.env.ATLAS_URI;
const database = process.env.DB_NAME;
const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbConnection;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      if (err || !db) {
        return callback(err);
      }

      dbConnection = db.db(database);
      console.log('Connected to database.');

      return callback();
    });
  },

  getDb: function () {
    return dbConnection;
  },
};
